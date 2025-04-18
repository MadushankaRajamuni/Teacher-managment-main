import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../common/breadcrumb/breadcrumb.component';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SETTINGS } from '../../../core/config/common.settings';
import { EmployeeService } from '../../../core/services/employee.service';
import { LeaveService } from '../../../core/services/leave.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AppUtils } from '../../../core/config/app.utils';

@Component({
  selector: 'app-add-edit-leave',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    NzButtonComponent,
    ReactiveFormsModule,
    NzOptionComponent,
    NzSelectComponent,
    NzFormModule,
    NzInputGroupComponent,
    NzDatePickerModule,
    NzSpinModule,
  ],
  templateUrl: './add-edit-leave.component.html',
  styleUrl: './add-edit-leave.component.scss',
  standalone: true
})
export class AddEditLeaveComponent implements OnInit {
  breadcrumbs: any[] = [
    { name: "Home", path: "/admin/dashboard" },
    { name: "Leave", path: "/admin/leave" },
    { name: "Add Leave Application" }
  ];

  leaveForm: any;
  loading = false;
  empForm: any;
  formErrors: any;
  leaveId: any;
  isEditLeave = false;
  leaveDays: number = 0;

  leaveCategoryList: any = [];
  leaveTypeList: any = [];
  leaveAssigneeList: any = [];

  constructor(
    private fb: NonNullableFormBuilder,
    private notification: NzNotificationService,
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.formErrors = {
      teacherName: {},
      designation: {},
      category: {},
      type: {},
      fromDate: {},
      toDate: {},
      leaveDays: {},
      reason: {},
      reliefAssignee: {}
    };
  }

  // Static dropdown options
  leaveCategories = [
    { label: 'Casual Leave', value: 'CASUAL' },
    { label: 'Sick Leave', value: 'SICK' },
    { label: 'Earned Leave', value: 'EARNED' },
  ];

  leaveTypes = [
    { label: 'Full Day', value: 'FULL' },
    { label: 'Half Day - Morning', value: 'HALF_MORNING' },
    { label: 'Half Day - Evening', value: 'HALF_EVENING' },
  ];

  assigneeList = [
    { id: '1', name: 'Alice Sharma' },
    { id: '2', name: 'Bob Mehta' },
    { id: '3', name: 'Carol Das' },
  ];

  ngOnInit() {
    this.initLeaveForm();

    this.leaveForm.get('fromDate')?.valueChanges.subscribe(() => this.calculateLeaveDays());
    this.leaveForm.get('toDate')?.valueChanges.subscribe(() => this.calculateLeaveDays());

    this.leaveId = this.route.snapshot.params['id'];
    if (this.leaveId) {
      this.isEditLeave = true;
      this.getOneLeave();
    }
  }

  initLeaveForm(): void {
    this.leaveForm = this.fb.group({
      teacherName: [null, Validators.required],
      designation: [null, Validators.required],
      category: [null, Validators.required],
      type: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      leaveDays: [null, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      reliefAssignee: [null, Validators.required],
    });

    this.leaveForm.valueChanges.subscribe(() => {
      this.formErrors = AppUtils.getFormErrors(this.leaveForm, this.formErrors);
    });
  }

  async getOneLeave(): Promise<void> {
    this.loading = true;
    try {
      const leave = await this.leaveService.getOneLeaveId(this.leaveId);
      this.leaveForm.patchValue(leave);
    } catch (e: any) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  submitLeaveApplication(): void {
    if (this.leaveForm.valid) {
      this.loading = true;
      const payload = this.leaveForm.getRawValue();

      try {
        if (this.isEditLeave && this.leaveId) {
          this.leaveService.updateLeave({ id: this.leaveId, ...payload });
          this.notification.success('Success', 'Leave application updated successfully!');
        } else {
          this.leaveService.createLeave(payload);
          this.notification.success('Success', 'Leave application submitted successfully!');
        }
        this.router.navigateByUrl('/admin/leaves');
      } catch (error: any) {
        console.error('Error saving leave application:', error);
        this.notification.error('Error', error.message || 'An error occurred while processing the leave application.');
      } finally {
        this.loading = false;
      }
    } else {
      console.log('Form is invalid');
    }
  }

  calculateLeaveDays() {
    const from = this.leaveForm.get('fromDate')?.value;
    const to = this.leaveForm.get('toDate')?.value;

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      this.leaveDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else {
      this.leaveDays = 0;
    }

    // Optionally set leaveDays field in form
    this.leaveForm.get('leaveDays')?.setValue(this.leaveDays, { emitEvent: false });
  }
}
