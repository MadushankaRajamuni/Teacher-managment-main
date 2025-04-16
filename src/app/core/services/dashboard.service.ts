import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = 'http://localhost:3000/dashboard'; // adjust this if your API is different

  constructor(private http: HttpClient) {}

  getSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/summary`);
  }

  getMonthlyLeaveStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/monthly-leaves`);
  }

  getRecentLogs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/recent-logs`);
  }
}
