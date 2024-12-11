import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { CreateEditEmployeeComponent } from '../../shared-components/create-edit-employee/create-edit-employee.component';

export default [
  {
    path: '',
    component: EmployeeComponent,
  },
  {
    path: 'create',
    component: CreateEditEmployeeComponent,
  },
  {
    path: ':id',
    component: CreateEditEmployeeComponent,
  }
] as Routes;
