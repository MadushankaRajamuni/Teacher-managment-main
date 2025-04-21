import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartConfiguration } from 'chart.js';
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
export class DashboardComponent implements OnInit, AfterViewInit {

  departmentCount = 0;
  employeeCount = 0;
  userCount = 0;
  leavesToday = 0;
  recentLogs: string[] = [];

  // Chart references
  @ViewChild('summaryChart', { static: false }) summaryChart?: BaseChartDirective;
  @ViewChild('monthlyChart', { static: false }) monthlyChart?: BaseChartDirective;

  // Flags to track data readiness
  dataLoaded = {
    summary: false,
    monthly: false
  };

  // Summary Chart Config
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
    animation: {
      duration: 0
    },
    plugins: {
      legend: { 
        display: true,
        position: 'top',
        onClick: () => {} // Empty function to disable legend click behavior
      }
    },
    scales: {
      x: { 
        ticks: { color: '#4B5563' },
        grid: { display: false }
      },
      y: { 
        ticks: { color: '#4B5563' },
        grid: { display: false },
        beginAtZero: true
      }
    }
  };

  // Monthly Chart Config
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

  monthlyBarChartOptions: ChartConfiguration<'bar'>['options'] = {
    ...this.summaryBarChartOptions
  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('DashboardComponent initialized');
    this.loadSummary();
    this.loadMonthlyLeaves();
    this.loadLogs();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    
    // Initial chart updates
    setTimeout(() => {
      if (this.summaryChart?.chart) {
        this.summaryChart.chart.update('none');
      }
      if (this.monthlyChart?.chart) {
        this.monthlyChart.chart.update('none');
      }
    }, 0);
  }

  async loadSummary() {
    try {
      const res = await this.dashboardService.getSummary();
      this.departmentCount = res.departments;
      this.employeeCount = res.employees;
      this.userCount = res.users;
      this.leavesToday = res.leavesToday;

      // Update chart data
      this.summaryBarChartData = {
        ...this.summaryBarChartData,
        datasets: [{
          ...this.summaryBarChartData.datasets[0],
          data: [
            this.departmentCount,
            this.employeeCount,
            this.userCount,
            this.leavesToday
          ]
        }]
      };

      this.dataLoaded.summary = true;
      this.cdr.detectChanges();
      
      // Update chart after data is loaded
      setTimeout(() => {
        if (this.summaryChart?.chart) {
          this.summaryChart.chart.update('none');
        }
      }, 0);
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  }

  async loadMonthlyLeaves() {
    try {
      const data = await this.dashboardService.getMonthlyLeaveStats();
      
      // Update chart data
      this.monthlyBarChartData = {
        ...this.monthlyBarChartData,
        labels: data.map((d: any) => d.month),
        datasets: [{
          ...this.monthlyBarChartData.datasets[0],
          data: data.map((d: any) => d.leaves)
        }]
      };

      this.dataLoaded.monthly = true;
      this.cdr.detectChanges();
      
      // Update chart after data is loaded
      setTimeout(() => {
        if (this.monthlyChart?.chart) {
          this.monthlyChart.chart.update('none');
        }
      }, 0);
    } catch (error) {
      console.error('Error loading monthly leave stats:', error);
    }
  }

  async loadLogs() {
    try {
      const logs = await this.dashboardService.getRecentLogs();
      this.recentLogs = logs;
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  }
}
