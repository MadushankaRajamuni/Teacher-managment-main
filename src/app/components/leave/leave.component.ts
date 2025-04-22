import { Component, OnInit } from '@angular/core';
import {SETTINGS} from '../../core/config/common.settings';
import { LeaveService } from '../../core/services/leave.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { BreadcrumbComponent } from '../common/breadcrumb/breadcrumb.component';
import { DatePipe } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzSpinComponent } from 'ng-zorro-antd/spin'; 
import { NzTableComponent, NzThMeasureDirective } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzImageDirective, NzImageModule } from 'ng-zorro-antd/image';  
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TruncateTextPipe } from '../../core/pipes/truncate-text.pipe';   
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-leave',
  imports: [
    BreadcrumbComponent,
    DatePipe,
    NzButtonComponent,
    NzIconDirective,
    NzPaginationComponent,
    NzSpinComponent,
    NzTableComponent,
    NzThMeasureDirective,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    NzImageDirective,
    NzModalModule,
    NzImageModule,
    TruncateTextPipe,
    CommonModule,
    NzDropDownModule,
    NzMenuModule,
    NgClass,
  ],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.scss'
})
export class LeaveComponent implements OnInit{
  breadcrumbs: any[] = [
    {
      name: "Home",
      path: "/admin/dashboard"
    },
    {
      name: "leave",
      path: "/admin/leave"
    }
  ];
  loading = false
  tableData: any[] = []
  departments: any[] = []
  status: any = null
  searchTerm: any = ''
  depart?: any;
  sortOrder: number = -1;
  totalRecords: number = 0
  pageIndex: number = 1
  pageSize: number = SETTINGS.PAGE_SIZE
  depLoading = false
  fallback = SETTINGS.PLACEHOLDER_IMG


  constructor(
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private leaveService: LeaveService,
    private message: NzMessageService,) {
}
ngOnInit() {
  Promise.all([ this.loadTableData()], )
}
openStatusMenu(item: any): void {
  console.log('Opening status menu for item:', item);
}
confirmStatusChange(item: any, newStatus: string): void {
  this.modalService.confirm({
    nzTitle: 'Are you sure?',
    nzContent: `Are you sure you want to change status to "${newStatus}"?`,
    nzOnOk: () => this.updateLeaveStatus(item._id, newStatus)
  });
}
async updateLeaveStatus(id: string, status: string): Promise<void> {
  try {
    const updated = await this.leaveService.updateLeaveStatus(id, status);
    this.message.success(`Status changed to ${status}`);
    this.loadTableData(); 
  } catch (error) {
    console.error(error);
    this.message.error('Failed to update status');
  }
}

async loadTableData(): Promise<void> {
  this.loading = true;
  try {
    const response = await this.leaveService.getPagedleave({
      filters: {
        status: this.status,
        searchTerm: this.searchTerm,
        depart: this.depart,
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

onSearch(){
  this.loadTableData()
}

onReset(){
  this.status = null;
  this.depart = null;
  this.searchTerm = ''
  this.loadTableData()
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
