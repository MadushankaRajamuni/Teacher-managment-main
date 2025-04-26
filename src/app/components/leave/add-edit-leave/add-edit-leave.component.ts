import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../common/breadcrumb/breadcrumb.component';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmployeeService } from '../../../core/services/employee.service';
import { LeaveService } from '../../../core/services/leave.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AppUtils } from '../../../core/config/app.utils';
import { Chart } from 'chart.js';
import { UserService } from '../../../core/services/user.service';  

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
    NzDatePickerModule,
    NzSpinModule,
  ],
  templateUrl: './add-edit-leave.component.html',
  styleUrl: './add-edit-leave.component.scss',
  standalone: true
})
export class AddEditLeaveComponent implements OnInit {
  breadcrumbs = [
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
  userList: any[] = [];

  leaveCategoryList: any[] = [];
  leaveTypeList: any[] = [];
  leaveAssigneeList: any[] = [];

  leaveBalances: any[] = [];

  teachers: any[] = [];
  

  constructor(
    private fb: NonNullableFormBuilder,
    private notification: NzNotificationService,
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
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
    };
  }

  leaveCategories = [
    { label: 'Casual Leave', value: 'CASUAL' },
    { label: 'Sick Leave', value: 'SICK' },
    { label: 'Earned Leave', value: 'EARNED' },
  ];

  designations = [
    { label: 'Grade I', value: 'GRADE_1' },
    { label: 'Grade II', value: 'GRADE_2' },
    { label: 'Grade III', value: 'GRADE_3' },
  ];

  leaveTypes = [
    { label: 'Full Day', value: 'FULL' },
    { label: 'Half Day - Morning', value: 'HALF_MORNING' },
    { label: 'Half Day - Evening', value: 'HALF_EVENING' },
  ];

  ngOnInit() {
    this.loadUsersData();
    this.initLeaveForm();
    this.leaveForm.get('fromDate')?.valueChanges.subscribe(() => {
      this.calculateLeaveDays();
    });
    this.leaveForm.get('toDate')?.valueChanges.subscribe(() => {
      this.calculateLeaveDays();
    });

    this.leaveId = this.route.snapshot.params['id'];
    if (this.leaveId) {
      this.isEditLeave = true;
      this.getOneLeave();
    }

    this.fetchLeaveBalances();
    
  }

  async loadUsersData(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.userService.getPagedUsers({}); 
   
      this.userList = response.users.filter((user: any) => user.role?.name === 'TEACHER');
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
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
      leaveDays: [{ value: null, disabled: true }],
      reason: ['', Validators.required],
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
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }


  fetchLeaveBalances(): void {
    this.leaveBalances = [
      { type: 'Casual Leave', availableDays: 5, usedDays: 2 },
      { type: 'Sick Leave', availableDays: 3, usedDays: 1 },
      { type: 'Duty Leave', availableDays: 10, usedDays: 4 },
    ];
    this.renderLeaveBalanceChart();
  }

  renderLeaveBalanceChart(): void {
    const canvas = document.getElementById('leaveBalanceChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.leaveBalances.map(lb => lb.type),
        datasets: [
          {
            label: 'Used Days',
            data: this.leaveBalances.map(lb => lb.used),
            backgroundColor: '#f5222d', // Red for used days
          },
          {
            label: 'Available Days',
            data: this.leaveBalances.map(lb => lb.available),
            backgroundColor: '#52c41a', // Green for available days
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return `${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Leave Type'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Days'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  calculateLeaveDays(): void {
    const fromDate = this.leaveForm.value.fromDate ? new Date(this.leaveForm.value.fromDate) : null;
    const toDate = this.leaveForm.value.toDate ? new Date(this.leaveForm.value.toDate) : null;
    
    // Ensure that both fromDate and toDate are selected before calculating leave days
    if (fromDate && toDate && fromDate <= toDate) {
      fromDate.setHours(0, 0, 0, 0); // Start of day
      toDate.setHours(23, 59, 59, 999); // End of day
    
      const timeDiff = Math.abs(toDate.getTime() - fromDate.getTime());
      this.leaveDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Add 1 to include both start and end day
    
      // Set the calculated leave days in the form
      this.leaveForm.get('leaveDays')?.setValue(this.leaveDays);
    } else {
      this.leaveForm.get('leaveDays')?.setValue(null); // If dates are invalid, clear the leave days
    }
  }
  
  

  async submitLeaveApplication(): Promise<void> {
    if (this.leaveForm.valid) {
      this.loading = true;
      const payload = this.leaveForm.getRawValue();
  
      try {
        if (this.isEditLeave && this.leaveId) {
          await this.leaveService.updateLeave({ id: this.leaveId, ...payload });
          this.notification.success('Success', 'Leave application updated successfully!');
        } else {
          await this.leaveService.createLeave(payload);
          this.notification.success('Success', 'Leave application submitted successfully!');
        }
        await this.router.navigateByUrl('/admin/leave');
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
  
}
