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
      this.http.post(`${SETTINGS.BASE_API}/log/get-paged`, {
        filters: {
          status: '',
          searchTerm: '',
        },
        pageIndex: 1,
        pageSize: 100,
        sortOrder: -1,
      }).subscribe({
        next: (response: any) => {
          // Extract the logs from the response
          const logs = response[0]?.data || [];
          resolve(logs);
        },
        error: (error: any) => reject(error)
      });
    });
  }

  getNotifications(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${SETTINGS.BASE_API}/dashboard/notifications`).subscribe({
        next: (response: any) => resolve(response),
        error: (error: any) => reject(error)
      });
    });
  }
}
