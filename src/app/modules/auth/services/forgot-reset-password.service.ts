import { Injectable } from '@angular/core';
import {SETTINGS} from '../../../core/config/common.settings';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotResetPasswordService {
  reqResetPasswordResponse: any = {};
  onReqResetPasswordResponseChange: Subject<any> = new BehaviorSubject({});

  constructor(private http: HttpClient) { }

  requestResetPassword(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${SETTINGS.BASE_API}/user/request-reset-password`, payload)
        .subscribe({
          next: (response: any) => {
            this.reqResetPasswordResponse = response;
            this.onReqResetPasswordResponseChange.next(
              this.reqResetPasswordResponse,
            );
            resolve(this.reqResetPasswordResponse);
          },
          error: (error: any) => {
            if (error.status === 403 || error === 403) {
            }
            reject(error.error);
          },
        });
    });
  }

  validatePWResetToken(token: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${SETTINGS.BASE_API}/user/validate-reset-password`, { token })
        .subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (error) => {
            reject(error.error);
          },
        });
    });
  }

  resetPassword(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${SETTINGS.BASE_API}/user/reset-password`, payload)
        .subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (error) => {
            reject(error.error);
          },
        });
    });
  }
}
