import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartConfiguration } from 'chart.js';
// import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

import { NgChartsModule, BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  departmentCount = 0;
  employeeCount = 0;
  userCount = 0;
  leavesToday = 0;
  recentLogs: string[] = [];

  // Chart references
  @ViewChild('summaryChart', { static: false }) summaryChart?: BaseChartDirective;
  @ViewChild('monthlyChart', { static: false }) monthlyChart?: BaseChartDirective;
  
  

  // Summary Bar Chart
  summaryBarChartData = {
    labels: ['Departments', 'Teachers', 'Users', 'Leaves Today'],
    datasets: [
      {
        label: 'System Stats',
        data: [0, 0, 0, 0],
        backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']
      }
    ]
  };

  summaryBarChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { ticks: { color: '#4B5563' } },
      y: { ticks: { color: '#4B5563' } }
    }
  };

  // Monthly Leaves Chart
  monthlyBarChartData = {
    labels: [] as string[],
    datasets: [
      {
        label: 'Leaves',
        data: [] as number[],
        backgroundColor: '#3B82F6'
      }
    ]
  };

  monthlyBarChartOptions: ChartConfiguration<'bar'>['options'] = this.summaryBarChartOptions;

  constructor(private dashboardService: DashboardService,  
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadMonthlyLeaves();
    this.loadLogs();
  }
  
  // ngAfterViewInit(): void {
    
  // }
  
  loadSummary() {
    this.dashboardService.getSummary().subscribe((res) => {
      this.departmentCount = res.departments;
      this.employeeCount = res.employees;
      this.userCount = res.users;
      this.leavesToday = res.leavesToday;
  
      this.summaryBarChartData.datasets[0].data = [
        this.departmentCount,
        this.employeeCount,
        this.userCount,
        this.leavesToday
      ];
  
      this.cdr.detectChanges();
  
      // Wait until chart instance is ready
      const interval = setInterval(() => {
        if (this.summaryChart?.chart) {
          this.summaryChart.update();
          clearInterval(interval);
        }
      }, 100);
    });
  }
  
  loadMonthlyLeaves() {
    this.dashboardService.getMonthlyLeaveStats().subscribe((data) => {
      this.monthlyBarChartData.labels = data.map((d: any) => d.month);
      this.monthlyBarChartData.datasets[0].data = data.map((d: any) => d.leaves);
  
      this.cdr.detectChanges();
  
      const interval = setInterval(() => {
        if (this.monthlyChart?.chart) {
          this.monthlyChart.update();
          clearInterval(interval);
        }
      }, 100);
    });
  }
  
  

  loadLogs() {
    this.dashboardService.getRecentLogs().subscribe((logs) => {
      // console.log('Recent logs:', logs);
      this.recentLogs = logs;
    });
  }
}
