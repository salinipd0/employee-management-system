import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EmployeeDbService } from 'app/core/auth/api-integration/employee-db.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-create-edit-employee',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule,
    MatSelectModule, CommonModule, MatDatepickerModule],
  templateUrl: './create-edit-employee.component.html',
  styleUrl: './create-edit-employee.component.scss',
  providers: [DatePipe],
})
export class CreateEditEmployeeComponent {

  isEdit: boolean = false;
  employeeFormDetails: UntypedFormGroup;
  employeeId: any;
  employeeDetails: any;

  selectedDate: Date | null = null;
  selectedDateTo: Date | null = null;
  calendarOpen: boolean = false;
  calendarType: any = 'from';

  constructor(private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _employeeDbApiService: EmployeeDbService,
    private datePipe: DatePipe
  ) {
    this._activatedRoute?.params.subscribe(params => {
      if (params?.id) {
        this.employeeId = Number(params?.id);
        this.isEdit = true;
      }
    });
  }

  ngOnInit(): void {
    this.employeeFormDetails = this._formBuilder.group({
      name: ['', [Validators.required]],
      role: ['', [Validators.required]],
      date_from: ['', [Validators.required]],
      date_to: ['', [Validators.required]],
    });

    if (this.isEdit) {
      this.getEmployeeDetails()
    }
  }

  getEmployeeDetails() {
    this._employeeDbApiService.getEmployeeById(this.employeeId).then((response: any) => {
      if (response) {
        this.patchValuesToForm(response);
      }
    })
  }

  patchValuesToForm(data: any) {
    // this.employeeFormDetails?.patchValue(data);
    const dateFrom = this.formatDate(data.date_from);
    const dateTo = this.formatDate(data.date_to);

    this.employeeFormDetails?.patchValue({
      ...data,
      date_from: dateFrom,
      date_to: dateTo
    });
  }

  formatDate(date: string): string {
    const parsedDate = new Date(date);
    return this.datePipe.transform(parsedDate, 'dd MMM yyyy') || '';
  }

  toggleCalendar(type: string) {
    if (this.calendarOpen && this.calendarType === type) {
      this.closeCalendar();
    } else {
      this.openCalendar(type);
    }
  }

  openCalendar(type: string) {
    this.calendarOpen = true;
    this.calendarType = type;
  }

  closeCalendar() {
    this.calendarOpen = false;
    this.calendarType = null;
  }

  onDateSelected(type: string, selectedDate: Date) {
    if (type === 'from') {
      this.selectedDate = selectedDate;
      this.employeeFormDetails.get('date_from').setValue(selectedDate);
    } else if (type === 'to') {
      this.selectedDateTo = selectedDate;
      this.employeeFormDetails.get('date_to').setValue(selectedDate);
    }
    this.closeCalendar();
  }

  saveDate() {
    console.log(this.employeeFormDetails.value);
    this.closeCalendar()
  }

  setToday() {
    const today = new Date();
    if (this.calendarType === 'from') {
      this.selectedDate = today;
      this.employeeFormDetails.get('date_from').setValue(today);
    } else if (this.calendarType === 'to') {
      this.selectedDateTo = today;
      this.employeeFormDetails.get('date_to').setValue(today);
    }
    this.closeCalendar();
  }

  setNextMonday() {
    const nextMonday = this.getNextWeekday(1);
    if (this.calendarType === 'from') {
      this.selectedDate = nextMonday;
      this.employeeFormDetails.get('date_from').setValue(nextMonday);
    } else if (this.calendarType === 'to') {
      this.selectedDateTo = nextMonday;
      this.employeeFormDetails.get('date_to').setValue(nextMonday);
    }
    this.closeCalendar();
  }

  setNextTuesday() {
    const nextTuesday = this.getNextWeekday(2);
    if (this.calendarType === 'from') {
      this.selectedDate = nextTuesday;
      this.employeeFormDetails.get('date_from').setValue(nextTuesday);
    } else if (this.calendarType === 'to') {
      this.selectedDateTo = nextTuesday;
      this.employeeFormDetails.get('date_to').setValue(nextTuesday);
    }
    this.closeCalendar();
  }

  setAfterOneWeek() {
    const afterOneWeek = new Date();
    afterOneWeek.setDate(afterOneWeek.getDate() + 7);
    if (this.calendarType === 'from') {
      this.selectedDate = afterOneWeek;
      this.employeeFormDetails.get('date_from').setValue(afterOneWeek);
    } else if (this.calendarType === 'to') {
      this.selectedDateTo = afterOneWeek;
      this.employeeFormDetails.get('date_to').setValue(afterOneWeek);
    }
    this.closeCalendar();
  }

  getNextWeekday(weekday: number): Date {
    const date = new Date();
    const currentDay = date.getDay();
    let daysToAdd = (weekday + 7 - currentDay) % 7;
    if (daysToAdd === 0) daysToAdd = 7;
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }

  createEditEmployee() {

    const formValues = this.employeeFormDetails.value;
    const dateFrom = this.convertToISO(formValues?.date_from);
    const dateTo = this.convertToISO(formValues?.date_to);

    const payload = {
      ...formValues,
      date_from: dateFrom,
      date_to: dateTo,
    };

    if (this.employeeFormDetails?.valid) {
      console.log(this.employeeFormDetails?.value);
      if (this.isEdit) {
        this.editEmployee(payload);
      } else {
        this.createEmployee(payload);
      }
    }
  }

  convertToISO(date: any): string {
    if (!date) return null;

    if (date instanceof Date) {
      return DateTime.fromJSDate(date).toISO();
    }

    if (DateTime.isDateTime(date)) {
      return date.toISO();
    }

    return DateTime.fromISO(date).toISO();
  }

  createEmployee(payload: any) {
    this._employeeDbApiService.addEmployee(payload).then((response: any) => {
      if (response) {
        this.navToPrevPage();
      }
    })
  }

  editEmployee(payload: any) {
    this._employeeDbApiService.updateEmployee(this.employeeId, payload).then((response: any) => {
      if (response) {
        this.navToPrevPage();
      }
    })
  }

  navToPrevPage() {
    this._router.navigate(['/employee']);
  }

  cancel() {
    this.employeeFormDetails.reset()
  }

}
