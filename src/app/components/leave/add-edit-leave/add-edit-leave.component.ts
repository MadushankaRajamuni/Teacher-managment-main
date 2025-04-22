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
  leaveBalances: any[] = [
    { type: 'Casual Leave', availableDays: 5, usedDays: 2 },
    { type: 'Sick Leave', availableDays: 3, usedDays: 1 },
    { type: 'Duty Leave', availableDays: 10, usedDays: 4 },
  ];

  teachers: any[] = [];
 

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
    };
  }

  // Static dropdown options
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
    this.loadTeachers();
    
    this.initLeaveForm();

    this.leaveForm.get('fromDate')?.valueChanges.subscribe(() => this.calculateLeaveDays());
    this.leaveForm.get('toDate')?.valueChanges.subscribe(() => this.calculateLeaveDays());

    this.leaveId = this.route.snapshot.params['id'];
    if (this.leaveId) {
      this.isEditLeave = true;
      this.getOneLeave();
    }

    // Render the leave balance chart
    this.renderLeaveBalanceChart();

    // Fetch leave balances when the component initializes
    this.fetchLeaveBalances();
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
  
  async loadTeachers(): Promise<void> {
    this.loading = true;
    try {
  
      const payload = {
        filters: {
          jobTitle: 'Teacher',  
        },
        pageIndex: 0,           
        pageSize: 100,         
        sortOrder: 1,          
      };
  
     
      console.log('Sending payload to get teachers:', payload);
  
      
      const response = await this.employeeService.getPagedEmployee(payload);
  
      
      this.teachers = response.map((teacher: any) => ({
        label: `${teacher.firstname} ${teacher.lastname}`,
        value: teacher._id,  
      }));
  
     
      console.log('Teachers loaded successfully:', this.teachers);
    } catch (e: any) {
      
      console.error('Error loading teachers:', e);
      if (e.response) {
        console.error('Error details:', e.response);
      }
      this.notification.error('Error', 'An error occurred while loading teachers.');
    } finally {
      this.loading = false;
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

  renderLeaveBalanceChart(): void {
    const ctx = document.getElementById('leaveBalanceChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Casual Leave', 'Sick Leave', 'Duty Leave'], // Leave categories
        datasets: [
          {
            label: 'Available Days',
            data: [5, 3, 10], // Available days for each leave type
            backgroundColor: '#4caf50', // Green color for available days
            borderColor: '#388e3c',
            borderWidth: 1
          },
          {
            label: 'Used Days',
            data: [2, 1, 4], // Used days for each leave type
            backgroundColor: '#ff9800', // Orange color for used days
            borderColor: '#f57c00',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false // Bars are grouped side by side
          },
          y: {
            beginAtZero: true,
            max: 21, // Set the maximum value of the Y-axis to 21
            ticks: {
              stepSize: 0.5, // Display points with half values (e.g., 0.5, 1.0, 1.5, etc.)
              callback: function(value) {
                return typeof value === 'number' ? value.toFixed(1) : value;
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top' // Position of the legend
          }
        }
      }
    });
  }

  fetchLeaveBalances(): void {
    // Replace this with your actual API call to fetch leave balances
    this.leaveBalances = [
      { type: 'Casual Leave', availableDays: 5, usedDays: 2 },
      { type: 'Sick Leave', availableDays: 3, usedDays: 1 },
      { type: 'Duty Leave', availableDays: 10, usedDays: 4 },
    ];
  }
}