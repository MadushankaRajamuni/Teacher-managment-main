import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { Router } from '@angular/router';

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
  pendingApprovals = 0;
  showAllActivities = false;
  recentLogs: any[] = [];
  displayedLogs: any[] = [];
  totalLogs = 0;

  // Chart references
  @ViewChild('summaryChart', { static: false }) summaryChart?: BaseChartDirective;
  @ViewChild('monthlyChart', { static: false }) monthlyChart?: BaseChartDirective;

  // Flags to track data readiness
  dataLoaded = {
    summary: false,
    monthly: false
  };

  // Summary card configurations
  summaryCards = [
    {
      title: 'Sections',
      count: 0,
      icon: 'M3 10h2l1 2h10l1-2h2M12 14v5m-4-5v5m8-5v5m-9-5H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v6a2 2 0 01-2 2h-3',
      color: 'text-blue-700',
      route: '/admin/departments'
    },
    {
      title: 'Teachers',
      count: 0,
      icon: 'M5.121 17.804A8.001 8.001 0 0112 2a8.001 8.001 0 016.879 15.804M15 12H9',
      color: 'text-green-600',
      route: '/admin/employees'
    },
    {
      title: 'Users',
      count: 0,
      icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-1.13a4 4 0 10-7.16-2.44A4 4 0 106.16 13',
      color: 'text-purple-600',
      route: '/admin/users'
    },
    {
      title: 'Leaves Today',
      count: 0,
      icon: 'M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7H3v10a2 2 0 002 2z',
      color: 'text-yellow-500',
      route: '/admin/leave'
    },
    {
      title: 'Pending Approvals',
      count: 0,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-red-600',
      route: '/admin/leave'
    }
  ];

  currentDate = new Date();

  // Summary Chart Config
  summaryBarChartData = {
    labels: ['Sections', 'Teachers', 'Users'],
    datasets: [
      {
        label: 'System Stats',
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 40,
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)'
        ]
      }
    ]
  };

  summaryBarChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { 
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          title: (items) => {
            return items[0].label;
          },
          label: (item) => {
            return `${item.parsed.y} ${item.label.toLowerCase()}`;
          }
        }
      }
    },
    scales: {
      x: { 
        grid: { 
          display: false
        },
        ticks: { 
          color: '#4B5563',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y: { 
        grid: { 
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: { 
          color: '#4B5563',
          font: {
            size: 12
          },
          stepSize: 1
        },
        beginAtZero: true
      }
    }
  };

  // Monthly Chart Config
  monthlyBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [] as string[],
    datasets: [{
      label: 'Leaves',
      data: [] as number[],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(139, 92, 246)',
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(139, 92, 246)'
      ],
      borderWidth: 2,
      borderRadius: 8,
      barThickness: 40,
      hoverBackgroundColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(139, 92, 246, 1)'
      ]
    }]
  };

  monthlyBarChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { 
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          title: (items) => {
            return items[0].label;
          },
          label: (item) => {
            return `${item.parsed.y} leaves`;
          }
        }
      }
    },
    scales: {
      x: { 
        grid: { 
          display: false
        },
        ticks: { 
          color: '#4B5563',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y: { 
        grid: { 
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: { 
          color: '#4B5563',
          font: {
            size: 12
          },
          stepSize: 1
        },
        beginAtZero: true
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router
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
      this.pendingApprovals = res.pendingApprovals || 0;

      // Update summary cards
      this.summaryCards[0].count = this.departmentCount;
      this.summaryCards[1].count = res.teachers; // Use the teachers count from the backend
      this.summaryCards[2].count = this.userCount;
      this.summaryCards[3].count = this.leavesToday;
      this.summaryCards[4].count = this.pendingApprovals;

      // Update chart data
      this.summaryBarChartData = {
        ...this.summaryBarChartData,
        datasets: [{
          ...this.summaryBarChartData.datasets[0],
          data: [
            this.departmentCount,
            res.teachers, // Update chart with teachers count
            this.userCount
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
        labels: data.map((d: any) => d.month),
        datasets: [{
          label: 'Leaves',
          data: data.map((d: any) => d.leaves),
          backgroundColor: '#3B82F6'
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
      console.log('Raw logs from service:', logs);
      // Transform logs to match the expected format
      this.recentLogs = logs.map((log: any) => ({
        message: log.message,
        timestamp: new Date(log.createdAt)
      }));
      this.totalLogs = this.recentLogs.length;
      console.log('Processed logs:', this.recentLogs);
      this.updateDisplayedLogs();
      console.log('Displayed logs:', this.displayedLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  }

  updateDisplayedLogs() {
    if (this.showAllActivities) {
      this.displayedLogs = this.recentLogs;
    } else {
      // Show only the 4 most recent logs
      this.displayedLogs = this.recentLogs.slice(0, 4);
    }
  }

  toggleShowAll() {
    this.showAllActivities = !this.showAllActivities;
    this.updateDisplayedLogs();
  }

  navigateToSummary(route: string) {
    this.router.navigate([route]);
  }

  navigateToAddLeave() {
    this.router.navigate(['/admin/leave/add-edit']);
  }
}
