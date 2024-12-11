import { CommonModule } from '@angular/common';
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
  styleUrl: './create-edit-employee.component.scss'
})
export class CreateEditEmployeeComponent {

  isEdit: boolean = false;
  employeeFormDetails: UntypedFormGroup;
  employeeId: any;
  employeeDetails: any;

  constructor(private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _employeeDbApiService: EmployeeDbService
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

  getEmployeeDetails(){
    this._employeeDbApiService.getEmployeeById(this.employeeId).then((response: any) => {
      if (response) {
        this.patchValuesToForm(response);
      }
    })
  }

  patchValuesToForm(data:any){
    this.employeeFormDetails?.patchValue(data);
  }

  createEditCounter() {

    const formValues = this.employeeFormDetails.value;
    const dateFrom =this.convertToISO(formValues?.date_from);
    const dateTo =this.convertToISO(formValues?.date_to);

    const payload = {
      ...formValues,
      date_from: dateFrom,
      date_to: dateTo,
    };

    if (this.employeeFormDetails?.valid) {
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

  createEmployee(payload:any) {
    this._employeeDbApiService.addEmployee(payload).then((response: any) => {
      if (response) {
        this.navToPrevPage();
      }
    })
  }

  editEmployee(payload:any) { 
    this._employeeDbApiService.updateEmployee(this.employeeId,payload).then((response: any) => {
      if (response) {
        this.navToPrevPage();
      }
    })
  }

  navToPrevPage() {
    this._router.navigate(['/employee']);
  }

  cancel() { }

}
