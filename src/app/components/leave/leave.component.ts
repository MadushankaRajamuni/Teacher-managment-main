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
import { UserService } from '../../core/services/user.service';



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
  userList: any[] = [];


  constructor(
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private leaveService: LeaveService,
    private message: NzMessageService,
    private userService: UserService) {
}
ngOnInit() {
  Promise.all([this.loadTableData(), this.loadUsersData()])
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

async loadUsersData(): Promise<void> {
  try {
    const response = await this.userService.getPagedUsers({}); 
    this.userList = response.users.filter((user: any) => user.role?.name === 'TEACHER');
  } catch (e) {
    console.error(e);
  }
}

getTeacherName(teacherId: string): string {
  const teacher = this.userList.find(user => user._id === teacherId);
  return teacher ? `${teacher.firstname} ${teacher.lastname}` : teacherId;
}

formatReferenceNumber(refNo: string): string {
  // If the reference number is a timestamp, format it as LV-YYYYMMDD-XXX
  if (refNo && refNo.startsWith('Leave')) {
    const timestamp = parseInt(refNo.replace('Leave', ''));
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `LV-${year}${month}${day}-${random}`;
  }
  return refNo;
}

async loadTableData(): Promise<void> {
  this.loading = true;
  try {
    // First ensure we have the user data
    if (this.userList.length === 0) {
      await this.loadUsersData();
    }

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
    this.tableData = pagedData[0]?.data.map((item: any) => ({
      ...item,
      teacherName: this.getTeacherName(item.teacherName),
      refNo: this.formatReferenceNumber(item.refNo)
    }));
    this.totalRecords = pagedData[0]?.metadata[0]?.total;
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
