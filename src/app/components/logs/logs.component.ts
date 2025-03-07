import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from '../common/breadcrumb/breadcrumb.component';
import {LogsService} from '../../core/services/logs.service';
import {SETTINGS} from '../../core/config/common.settings';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {NzTableComponent, NzThMeasureDirective} from 'ng-zorro-antd/table';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {DatePipe} from '@angular/common';
import {NzPaginationComponent} from 'ng-zorro-antd/pagination';
import {UnderscoreToSpaceAndCamelCasePipe} from '../../core/pipes/underscore-to-space-and-camel-case.pipe';

@Component({
  selector: 'app-logs',
  imports: [
    BreadcrumbComponent,
    NzSpinComponent,
    NzTableComponent,
    NzIconDirective,
    NzThMeasureDirective,
    DatePipe,
    NzPaginationComponent,
    UnderscoreToSpaceAndCamelCasePipe
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
  standalone: true
})
export class LogsComponent implements OnInit{

  breadcrumbs: any[] = [
    {
      name: "Home",
      path: "/admin/dashboard"
    },
    {
      name: "Logs",
      path: "/admin/logs"
    }
  ];
  loading = false
  tableData: any[] = []
  sortOrder: number = -1;
  totalRecords: number = 0
  pageIndex: number = 1
  pageSize: number = SETTINGS.PAGE_SIZE

  constructor(private logsService: LogsService) {
  }

  ngOnInit() {
    Promise.all([ this.loadTableData()])
  }

  async loadTableData(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.logsService.getPagedLogs({
        filters: {
          status: '',
          searchTerm: '',
        },
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sortOrder: this.sortOrder,
      })

      const pagedData = response as any;
      this.tableData = pagedData[0]?.data;
      this.totalRecords  = pagedData[0]?.metadata[0]?.total;
      this.loading = true;
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false;
    }
  }
  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadTableData();
  }
  sort(): void {
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.loadTableData();
  }

}
