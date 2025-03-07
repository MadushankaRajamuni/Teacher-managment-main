import {Component, OnInit} from '@angular/core';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from 'ng-zorro-antd/form';
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzAlertComponent} from 'ng-zorro-antd/alert';
import {ActionAlert} from '../../../core/dto/actionAlert';
import {Router} from '@angular/router';
import {ForgotResetPasswordService} from '../services/forgot-reset-password.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    NzFormDirective,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzIconDirective,
    NzInputDirective,
    NzButtonComponent,
    NzAlertComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: true
})
export class ForgotPasswordComponent implements OnInit{
  forgotPasswordForm: any

  btnLoading = false;
  actionMessage = new ActionAlert();

  constructor(
    private forgotPasswordService: ForgotResetPasswordService,
    private fb: NonNullableFormBuilder,
    private router: Router,
  ) {
  }
  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async navigateWithDelay(): Promise<void> {
    // Delay for 5 seconds (5000 milliseconds)
    await new Promise((resolve) => setTimeout(resolve, 5000));
    this.router.navigate(['/auth/login']);
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid) {
      Object.keys(this.forgotPasswordForm.controls).forEach((field) => {
        const control = this.forgotPasswordForm.get(field);
        control?.markAsTouched({onlySelf: true});
      });
      return;
    }

    this.btnLoading = true;
    try {
      const res = await this.forgotPasswordService.requestResetPassword(
        this.forgotPasswordForm.value,
      );

      if (res.done) {
        this.actionMessage = {
          display: true,
          type: 'success',
          message: 'Password reset link has been sent to your email address.',
        };
      } else {
        this.actionMessage = {
          display: true,
          type: 'error',
          message: res.message || 'Password reset failed. Please try again.',
        };
      }
    } catch (e: any) {
      this.actionMessage = {
        display: true,
        type: 'error',
        message: e.message || 'Password reset failed. Please try again.',
      };
    } finally {
      this.btnLoading = false;
      this.navigateWithDelay();
    }
  }

}
