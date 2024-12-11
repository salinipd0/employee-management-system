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
  ) {
    this._activatedRoute?.params.subscribe(params => {
      if (params?.id) {
        this.employeeId = params?.id;
        this.isEdit = true;
      }
    });
  }

  ngOnInit(): void {
    this.employeeFormDetails = this._formBuilder.group({
      full_name: ['', [Validators.required]],
      role: ['', [Validators.required]],
      date_from: ['', [Validators.required]],
      date_to: ['', [Validators.required]],
    });

    if (this.isEdit) {
    }
  }

  createEditCounter() { }

  navToPrevPage() {
    this._router.navigate(['/employee']);
  }

  cancel() { }

}
