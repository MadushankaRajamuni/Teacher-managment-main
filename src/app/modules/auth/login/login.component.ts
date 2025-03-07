import {Component, OnInit} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {Router} from '@angular/router';
import {ActionAlert} from '../../../core/dto/actionAlert';
import {NzButtonComponent, NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {CommonModule} from '@angular/common';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    NzButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    NzIconModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent implements OnInit {
  loginForm: any

  passwordVisible = false;
  btnLoading = false;
  actionMessage = new ActionAlert();

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin']);
    }
  }

  ngOnInit() {
    this.initLoginForm()
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  navigate(): void {
    this.router.navigate([`/auth/forgot-password`]);
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach((field) => {
        const control = this.loginForm.get(field);
        control?.markAsTouched({onlySelf: true});
      });
      return;
    }

    this.btnLoading = true;
    try {
      await this.authService.login(this.loginForm.value);
      this.router.navigate(['/admin']);
    } catch (e: any) {
      this.actionMessage = {
        display: true,
        type: 'error',
        message: e.message || 'Login failed. Please try again.',
      };
    } finally {
      this.btnLoading = false;
    }
  }
}
