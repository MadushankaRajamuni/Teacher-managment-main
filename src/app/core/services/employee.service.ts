import { Injectable } from '@angular/core';
import {SETTINGS} from '../config/common.settings';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  createEmployee(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${SETTINGS.BASE_API}/employee/create`, payload).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error: any) => {
          reject(error.error);
        },
      });
    });
  }
  getPagedEmployee(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${SETTINGS.BASE_API}/employee/get-paged`, payload).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }
  updateEmployee(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(`${SETTINGS.BASE_API}/employee/update`, payload).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error: any) => {
          reject(error.error);
        },
      });
    });
  }

  getOneEmployeeById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${SETTINGS.BASE_API}/employee/emp/${id}`).subscribe({
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
