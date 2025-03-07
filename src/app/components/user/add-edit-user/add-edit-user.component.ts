import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from '../../common/breadcrumb/breadcrumb.component';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from 'ng-zorro-antd/form';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {RoleService} from '../../../core/services/role.service';
import {NzBreadCrumbItemComponent} from 'ng-zorro-antd/breadcrumb';
import {UnderscoreToSpaceAndCamelCasePipe} from '../../../core/pipes/underscore-to-space-and-camel-case.pipe';
import {SETTINGS} from '../../../core/config/common.settings';
import {AppUtils} from '../../../core/config/app.utils';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {UserService} from '../../../core/services/user.service';
import {NzUploadComponent, NzUploadFile} from 'ng-zorro-antd/upload';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {Observable, Observer} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FileService} from '../../../core/services/file.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-edit-user',
  imports: [BreadcrumbComponent, NzFormItemComponent, NzFormControlComponent, NzInputGroupComponent, NzFormDirective, NzInputDirective, NzButtonComponent, NzSelectComponent, NzOptionComponent, UnderscoreToSpaceAndCamelCasePipe, ReactiveFormsModule, NzUploadComponent, NzIconDirective],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss',
  standalone: true
})
export class AddEditUserComponent implements OnInit {
  breadcrumbs: any[] = [
    {
      name: "Home",
      path: "/admin/dashboard"
    },
    {
      name: "User",
      path: "/admin/users"
    },
    {
      name: "Add User",
    }
  ];
  roles: any[] = [];
  userForm: any;
  formErrors: any;
  uploading = false;
  imageUrl?: string;

  constructor(private rolesService: RoleService,
              private fb: NonNullableFormBuilder,
              private notification: NzNotificationService,
              private userService: UserService,
              private messageService: NzMessageService,
              private fileService: FileService,
              protected router: Router,) {
    this.formErrors = {
      firstname: {},
      lastname: {},
      email: {},
      role: {},
      mobile: {},
    }

  }

  ngOnInit() {
    this.initUserForm();
    Promise.all([ this.loadRoles()])
  }

  initUserForm(): any {
    this.userForm = this.fb.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      role: [null, Validators.required],
      mobile: [null, [
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(SETTINGS.REGEX.PHONE.EXP),
        ]),
      ],
      ],
    });

    this.userForm.valueChanges.subscribe(() => {
      this.formErrors = AppUtils.getFormErrors(this.userForm, this.formErrors);
    });
  }


  async loadRoles(): Promise<any> {
    try {
      this.roles = await this.rolesService.getRolesForOptions()
    } catch (e) {
      console.error(e);
    }
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

  async saveUser(): Promise<void> {
    if (this.userForm.valid) {
      const payload = this.userForm.getRawValue();
      payload.imageUrl = this.imageUrl
      try {
        await this.userService.createUser(payload)
        this.notification.success('Success', 'User created successfully!');
        await this.router.navigateByUrl('/admin/users')
      } catch (e) {
        console.error('Error creating user:', e);
        this.notification.error('Error', 'Failed to create user. Please try again.',);
      }
    } else {
      console.log('Form is invalid');
    }
  }

  protected readonly SETTINGS = SETTINGS;
}
