import { Injectable } from '@angular/core';
import {SETTINGS} from '../config/common.settings';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  createDepart(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${SETTINGS.BASE_API}/department/create`, payload).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error: any) => {
          reject(error.error);
        },
      });
    });
  }
  getPagedDepart(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${SETTINGS.BASE_API}/department/get-paged`, payload).subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (error: any) => {
            reject(error);
          },
        });
    });
  }
  updateDepart(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(`${SETTINGS.BASE_API}/department/update`, payload).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error: any) => {
          reject(error.error);
        },
      });
    });
  }

  getOneDepartById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${SETTINGS.BASE_API}/department/depart/${id}`).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }
  getActiveDeparts(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${SETTINGS.BASE_API}/department/active`).subscribe({
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
