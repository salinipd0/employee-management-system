import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { EmployeeDbService } from 'app/core/auth/api-integration/employee-db.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatTooltipModule, CommonModule, DatePipe],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {

  searchInputControl: UntypedFormControl = new UntypedFormControl();;
  employeeList: any | [];
  filteredEmployeeList: any | [];
  displayedColumnBranches: any = ['name', 'role', 'date', 'action'];

  constructor(private _router: Router,
    private _employeeDbApiService: EmployeeDbService
  ) { }

  ngOnInit(): void {
    this.getEmployeeList();

    this.searchInputControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe((value: any) => this.filterEmployees(value));
  }

  getEmployeeList() {
    this._employeeDbApiService.getEmployees().then((response: any) => {
      if (response) {
        if (response?.length > 0) {
          this.employeeList = response;
          this.filteredEmployeeList = this.employeeList;
        } else{
          this.employeeList = [];
          this.filteredEmployeeList = this.employeeList;
        }
      }
    })
  }

  filterEmployees(searchValue: string) {
    if (!searchValue) {
      this.filteredEmployeeList = this.employeeList;
      return;
    }

    const lowerCaseSearchValue = searchValue.toLowerCase();
    this.filteredEmployeeList = this.employeeList?.filter((employee: any) =>
      employee?.name?.toLowerCase().includes(lowerCaseSearchValue)
    );
  }

  createEmployee() {
    this._router.navigate(['/employee/create']);
  }

  editEmployee(employeeData: any) {
    this._router.navigate([`/employee/${employeeData?.id}`]);
  }

  deleteEmployee(employeeData: any) {
    this._employeeDbApiService?.deleteEmployee(Number(employeeData?.id)).then((response: any) => {
      this.getEmployeeList();
    })
  }
}
