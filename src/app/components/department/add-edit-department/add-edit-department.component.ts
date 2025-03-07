import {Component, inject, OnInit} from '@angular/core';
import {BreadcrumbComponent} from '../../common/breadcrumb/breadcrumb.component';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzInputDirective, NzInputGroupComponent, NzTextareaCountComponent} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {AppUtils} from '../../../core/config/app.utils';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {DepartmentService} from '../../../core/services/department.service';
import {NzColDirective} from 'ng-zorro-antd/grid';
import {ActivatedRoute, Router} from '@angular/router';
import {NzSpinComponent} from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-add-edit-department',
  imports: [
    BreadcrumbComponent,
    NzFormDirective,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzInputDirective,
    NzButtonComponent,
    NzTextareaCountComponent,
    NzColDirective,
    NzSpinComponent
  ],
  templateUrl: './add-edit-department.component.html',
  styleUrl: './add-edit-department.component.scss',
  standalone: true
})
export class AddEditDepartmentComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);

  breadcrumbs: any[] = [
    {
      name: "Home",
      path: "/admin/dashboard"
    },
    {
      name: "Department",
      path: "/admin/departments"
    },
    {
      name: "Add Department",
    }
  ];
  departForm: any;
  formErrors: any;
  depId: any;
  loading = false

  constructor(private fb: NonNullableFormBuilder,
              private notification: NzNotificationService,
              private departService: DepartmentService,
              protected router: Router) {
    this.formErrors = {
      depName: {},
      description: {},
    }
  }

  ngOnInit() {
    this.depId = this.route.snapshot.params['id']
    this.initUserForm()
    if (this.depId) {
      this.getOneDepart()
    }
  }

  initUserForm(): any {
    this.departForm = this.fb.group({
      depName: [null, Validators.required],
      description: [null],
    });

    this.departForm.valueChanges.subscribe(() => {
      this.formErrors = AppUtils.getFormErrors(this.departForm, this.formErrors);
    });
  }
  async getOneDepart(): Promise<void> {
    this.loading = true
    try {
      const depart = await this.departService.getOneDepartById(this.depId)
      this.departForm.patchValue(depart);
    }  catch (e: any) {
      console.error(e)
    }
    finally {
      this.loading = false
    }
  }

  async saveDepart(): Promise<void> {
    if (this.departForm.valid) {
      this.loading = true
      const payload = this.departForm.getRawValue()
      if (this.depId) {
        try {
          await this.departService.updateDepart({id: this.depId, ...payload})
          this.notification.success('Success', 'Department update successfully!');
          await this.router.navigateByUrl('/admin/departments')
        } catch (e: any) {
          console.error('Error update department:', e);
          if (e.depCheck) {
            this.notification.error('Error', e.message,);
          } else {
            this.notification.error('Error', 'Failed to update department. Please try again.',);
          }
        } finally {
          this.loading = false
        }
      } else {
        try {
          await this.departService.createDepart(payload)
          this.notification.success('Success', 'Department created successfully!');
          await this.router.navigateByUrl('/admin/departments')
        } catch (e: any) {
          console.error('Error creating department:', e);
          if (e.depCheck) {
            this.notification.error('Error', e.message,);
          } else {
            this.notification.error('Error', 'Failed to create department. Please try again.',);
          }
        } finally {
          this.loading = false
        }
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
