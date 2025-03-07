import {Component, inject, OnInit} from '@angular/core';
import {BreadcrumbComponent} from '../../common/breadcrumb/breadcrumb.component';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent, NzTextareaCountComponent} from "ng-zorro-antd/input";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {UnderscoreToSpaceAndCamelCasePipe} from '../../../core/pipes/underscore-to-space-and-camel-case.pipe';
import {SETTINGS} from '../../../core/config/common.settings';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzUploadComponent, NzUploadFile} from 'ng-zorro-antd/upload';
import {ActivatedRoute, Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {DepartmentService} from '../../../core/services/department.service';
import {AppUtils} from '../../../core/config/app.utils';
import {EmployeeService} from '../../../core/services/employee.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FileService} from '../../../core/services/file.service';

@Component({
  selector: 'app-add-edit-employee',
  imports: [
    BreadcrumbComponent,
    NzButtonComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzInputDirective,
    NzInputGroupComponent,
    NzSpinComponent,
    ReactiveFormsModule,
    NzOptionComponent,
    NzSelectComponent,
    NzIconDirective,
    NzUploadComponent
  ],
  templateUrl: './add-edit-employee.component.html',
  styleUrl: './add-edit-employee.component.scss',
  standalone: true
})
export class AddEditEmployeeComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);

  breadcrumbs: any[] = [
    {
      name: "Home",
      path: "/admin/dashboard"
    },
    {
      name: "Employee",
      path: "/admin/employees"
    },
    {
      name: "Add Employee",
    }
  ];
  empForm: any;
  formErrors: any;
  empId: any;
  loading = false
  departments: any = []
  uploading = false;
  imageUrl?: string;

  constructor(private fb: NonNullableFormBuilder,
              private notification: NzNotificationService,
              private departService: DepartmentService,
              protected router: Router,
              private employeeService: EmployeeService,
              private messageService: NzMessageService,
              private fileService: FileService) {
    this.formErrors = {
      firstname: {},
      lastname: {},
      jobTitle: {},
      nic: {},
      email: {},
      mobile: {},
      department: {},
    }

  }

  ngOnInit() {
    this.empId = this.route.snapshot.params['id']
    this.initEmpForm()
    Promise.all([this.loadDepartsData()])
    if (this.empId) {
      this.getOneEmp()
    }
  }

  async loadDepartsData(): Promise<void> {
    this.loading = true
    try {
      const response = await this.departService.getActiveDeparts()
      this.departments = response
    } catch (e: any) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  async getOneEmp(): Promise<void> {
    this.loading = true
    try {
      const emp = await this.employeeService.getOneEmployeeById(this.empId)
      this.empForm.patchValue(emp);
    }  catch (e: any) {
      console.error(e)
    }
    finally {
      this.loading = false
    }
  }

  initEmpForm(): any {
    this.empForm = this.fb.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      jobTitle: [null, Validators.required],
      nic: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      mobile: [null, [
        Validators.compose([
          Validators.maxLength(10),
          Validators.pattern(SETTINGS.REGEX.PHONE.EXP),
        ]),
      ],
      ],
      department: [null, Validators.required]
    });

    this.empForm.valueChanges.subscribe(() => {
      this.formErrors = AppUtils.getFormErrors(this.empForm, this.formErrors);
    });
  }


  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.uploading = true;
        this.fileService.postFile(info.file.originFileObj).subscribe(
          res => {
            this.imageUrl = res?.url
            this.messageService.success('File uploading success');
            this.uploading = false;
          },
          (e: any) => {
            this.messageService.error('Failed to upload. Please try again.');
            console.error(e)
            this.uploading = false;
          }
        );
        break;
    }
  }

  async saveEmployee(): Promise<void> {
    if (this.empForm.valid) {
      this.loading = true
      const payload = this.empForm.getRawValue()
      payload.imageUrl = this.imageUrl
      if (this.empId) {
        try {
          await this.employeeService.updateEmployee({id: this.empId, ...payload})
          this.notification.success('Success', 'Employee update successfully!');
          await this.router.navigateByUrl('/admin/employees')
        } catch (e: any) {
          console.error('Error update employee:', e);
          if (e.empCheck) {
            this.notification.error('Error', e.message,);
          } else {
            this.notification.error('Error', 'Failed to update employee. Please try again.',);
          }
        } finally {
          this.loading = false
        }
      } else {
        try {
          await this.employeeService.createEmployee(payload)
          this.notification.success('Success', 'Employee created successfully!');
          await this.router.navigateByUrl('/admin/employees')
        } catch (e: any) {
          console.error('Error creating employee:', e);
          if (e.depCheck) {
            this.notification.error('Error', e.message,);
          } else {
            this.notification.error('Error', 'Failed to create employee. Please try again.',);
          }
        } finally {
          this.loading = false
        }
      }
    } else {
      console.log('Form is invalid');
    }
  }

  protected readonly SETTINGS = SETTINGS;
}
