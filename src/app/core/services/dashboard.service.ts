import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SETTINGS } from '../config/common.settings'; // Keep consistent with your structure

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getSummary(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${SETTINGS.BASE_API}/dashboard/summary`).subscribe({
        next: (response: any) => resolve(response),
        error: (error: any) => reject(error)
      });
    });
  }

  // getDepartmentStats(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(`${SETTINGS.BASE_API}/dashboard/department-stats`).subscribe({
  //       next: (response: any) => resolve(response),
  //       error: (error: any) => reject(error)
  //     });
  //   });
  // }

  getMonthlyLeaveStats(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${SETTINGS.BASE_API}/dashboard/monthly-leaves`).subscribe({
        next: (response: any) => resolve(response),
        error: (error: any) => reject(error)
      });
    });
  }

  getRecentLogs(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${SETTINGS.BASE_API}/dashboard/recent-logs`).subscribe({
        next: (response: any) => resolve(response),
        error: (error: any) => reject(error)
      });
    });
  }
}
