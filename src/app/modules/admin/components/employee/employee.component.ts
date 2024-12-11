import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatTooltipModule, CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {

  searchInputControl: UntypedFormControl = new UntypedFormControl();;
  employeeList: any | [];
  filteredEmployeeList: any = [
    { id: 1, full_name: 'salini', role: 'angular developer', date: 'dec 18 2024 - ' }
  ];
  displayedColumnBranches: any = ['full_name', 'role', 'date', 'action'];

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this.employeeList = this.filteredEmployeeList;

    this.searchInputControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe((value: any) => this.filterEmployees(value));
  }

  filterEmployees(searchValue: string) {
    if (!searchValue) {
      this.filteredEmployeeList = this.employeeList;
      return;
    }

    const lowerCaseSearchValue = searchValue.toLowerCase();
    this.filteredEmployeeList = this.employeeList?.filter((employee: any) =>
      employee?.full_name?.toLowerCase().includes(lowerCaseSearchValue)
    );
  }

  createEmployee() {
    this._router.navigate(['/employee/create']);
  }

  editEmployee(employeeData: any) {
    this._router.navigate([`/employee/${employeeData?.id}`]);
  }

  deleteEmployee(employeeData: any) { }
}
