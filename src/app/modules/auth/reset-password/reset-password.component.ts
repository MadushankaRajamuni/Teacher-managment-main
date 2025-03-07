import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActionAlert} from '../../../core/dto/actionAlert';
import {ActivatedRoute, Router} from '@angular/router';
import {ForgotResetPasswordService} from '../services/forgot-reset-password.service';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from 'ng-zorro-antd/form';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzAlertComponent} from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-reset-password',
  imports: [
    NzFormDirective,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzIconDirective,
    NzInputDirective,
    NzButtonComponent,
    NzAlertComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  standalone: true
})
export class ResetPasswordComponent implements OnInit{
  resetPasswordForm: any

  passwordVisible = false;
  newPasswordVisible = false;
  btnLoading = false;
  actionMessage = new ActionAlert();
  userToken: string | null = null;
  validating = true;

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private forgotPasswordService: ForgotResetPasswordService,
  ) {}

  ngOnInit(): void {
    this.userToken = this.route.snapshot.paramMap.get('token');
    this.resetPasswordForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          ),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.passwordMatchValidator.bind(this)],
      ],
    });
    this.validateToken();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleNewPasswordVisibility(): void {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  passwordMatchValidator(
    control: FormControl,
  ): { [s: string]: boolean } | null {
    if (!control.value) {
      return { required: true };
    } else if (
      control.value !== this.resetPasswordForm.controls.newPassword.value
    ) {
      return { mismatch: true };
    }
    return null;
  }

  async validateToken(): Promise<void> {
    try {
      const response = await this.forgotPasswordService.validatePWResetToken(
        this.userToken,
      );
      if (!response.done) {
        this.actionMessage = {
          display: true,
          type: 'error',
          message: 'Token is invalid or expired.',
        };
        this.validating = false;
      }
    } catch (error) {
      this.actionMessage = {
        display: true,
        type: 'error',
        message: 'Token validation failed.',
      };
      this.validating = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.invalid) {
      Object.keys(this.resetPasswordForm.controls).forEach((field) => {
        const control = this.resetPasswordForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.btnLoading = true;
    try {
      const formData = this.resetPasswordForm.getRawValue();
      const payload = {
        token: this.userToken,
        password: formData.newPassword,
      };
      const res = await this.forgotPasswordService.resetPassword(payload);
      this.actionMessage = {
        display: true,
        type: 'success',
        message: 'Password has been reset successfully.',
      };
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 4000);
    } catch (e: any) {
      this.actionMessage = {
        display: true,
        type: 'error',
        message: e.message || 'Password reset failed. Please try again.',
      };
    } finally {
      this.btnLoading = false;
    }
  }
}
