import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {SETTINGS} from '../config/common.settings';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
 
    constructor(private http: HttpClient) {}

    createLeave(payload: any): Promise<any> {
      return new Promise((resolve, reject) => {
        this.http.post(`${SETTINGS.BASE_API}/leave/create`, payload).subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (error: any) => {
            reject(error.error);
          },
        });
      });
    }
    getPagedleave(payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
          this.http
            .post(`${SETTINGS.BASE_API}/leave/get-paged`, payload).subscribe({
            next: (response: any) => {
              resolve(response);
            },
            error: (error: any) => {
              reject(error);
            },
          });
        });
      }
      updateLeave(payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
          this.http.put(`${SETTINGS.BASE_API}/leave/update`, payload).subscribe({
            next: (response: any) => {
              resolve(response);
            },
            error: (error: any) => {
              reject(error.error);
            },
          });
        });
      }
    
      getOneLeaveId(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
          this.http.get(`${SETTINGS.BASE_API}/leave/lv/${id}`).subscribe({
            next: (response: any) => {
              resolve(response);
            },
            error: (error: any) => {
              reject(error);
            },
          });
        });
      }
}
