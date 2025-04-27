import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from '../common/breadcrumb/breadcrumb.component';
import {DatePipe} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {SETTINGS} from '../../core/config/common.settings';
import {DepartmentService} from '../../core/services/department.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzModalModule, NzModalService} from 'ng-zorro-antd/modal';
import {EmployeeService} from '../../core/services/employee.service';
import {NzImageDirective, NzImageModule} from 'ng-zorro-antd/image';
import {TruncateTextPipe} from '../../core/pipes/truncate-text.pipe';
import {UserService} from '../../core/services/user.service';


@Component({
  selector: 'app-user',
  imports: [BreadcrumbComponent,
    DatePipe,
    NzButtonComponent,
    NzIconDirective,
    NzInputDirective,
    NzInputGroupComponent,
    NzOptionComponent,
    NzPaginationComponent,
    NzSelectComponent,
    NzSpinComponent,
    NzSwitchComponent,
    NzTableComponent,
    NzThMeasureDirective,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    NzImageDirective,
    NzModalModule,
    NzImageModule,
    TruncateTextPipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  standalone: true
})
export class UserComponent {
  breadcrumbs: any[] = [
    {
      name: "Home",
      path: "/admin/dashboard"
    },
    {
      name: "User",
      path: "/admin/users"
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


  constructor(private departService: DepartmentService,
              private notification: NzNotificationService,
              private modalService: NzModalService,
              private employeeService: EmployeeService,
              private userService: UserService) {
  }

  ngOnInit() {
    Promise.all([ this.loadTableData()], )
  }

  async loadTableData(): Promise<void> {
    this.loading = true;
    try {
      // Convert 1-based page index to 0-based for backend
      const backendPageIndex = this.pageIndex - 1;
      
      console.log('Loading table data with page:', this.pageIndex, 'backend page:', backendPageIndex, 'size:', this.pageSize);
      
      const response = await this.userService.getPagedUsers({
        filters: {
          status: this.status,
          searchTerm: this.searchTerm,
          depart: this.depart,
        },
        pageIndex: backendPageIndex,  // Send 0-based index to backend
        pageSize: this.pageSize,
        sortOrder: this.sortOrder,
      });
  
      console.log('Pagination response:', response);
      const pagedData = response as any;
      
      // Ensure we have valid data
      if (!pagedData || !Array.isArray(pagedData.users)) {
        console.error('Invalid response format:', pagedData);
        this.notification.error('Error', 'Invalid data received from server');
        return;
      }
      
      this.tableData = pagedData.users;
      this.totalRecords = pagedData.total || 0;
      
      // Log pagination state
      console.log('Current page:', this.pageIndex);
      console.log('Page size:', this.pageSize);
      console.log('Total records:', this.totalRecords);
      console.log('Current data length:', this.tableData.length);
      
      // Validate pagination state
      if (this.tableData.length > this.pageSize) {
        console.warn('Received more items than page size:', this.tableData.length, '>', this.pageSize);
      }
      
      if (this.totalRecords < this.tableData.length) {
        console.warn('Total records less than current data length:', this.totalRecords, '<', this.tableData.length);
      }
    } catch (e) {
      console.error('Error loading table data:', e);
      this.notification.error('Error', 'Failed to load users. Please try again.');
    } finally {
      this.loading = false;
    }
  }
  
// async loadTableData(): Promise<void> {
//   this.loading = true;
//   try {
//     const response = await this.userService.getPagedUsers({
//       filters: {
//         status: this.status,
//         searchTerm: this.searchTerm,
//         depart: this.depart,
//       },
//       pageIndex: this.pageIndex,
//       pageSize: this.pageSize,
//       sortOrder: this.sortOrder,
//     })

//     const pagedData = response as any;
//     this.tableData = pagedData.users;
//     this.totalRecords  = pagedData.total;
//     this.loading = true;
//   } catch (e) {
//     console.error(e)
//   } finally {
//     this.loading = false;
//   }
// }


  onSearch(){
    this.pageIndex = 1; // Reset to first page on search
    this.loadTableData()
  }

  onReset(){
    this.status = null;
    this.depart = null;
    this.searchTerm = ''
    this.pageIndex = 1; // Reset to first page on reset
    this.loadTableData()
  }

  onPageChange(pageIndex: number): void {
    console.log('Page changed to:', pageIndex);
    if (pageIndex < 1) {
      console.warn('Invalid page index:', pageIndex);
      return;
    }
    this.pageIndex = pageIndex;
    this.loadTableData();
  }
  sort(): void {
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.loadTableData();
  }

  async onSwitchChange(event: any, item: any): Promise<void> {
    this.loading = true
    try {
      await this.employeeService.updateEmployee({id: item._id, active: event, type: 'STATUS'})
      this.notification.success('Success', `Employee update successfully!`);
      await this.loadTableData()
    } catch (e: any) {
      console.error(e)
      this.notification.error('Error', 'Failed to update employee. Please try again.',);
    } finally {
      this.loading = false
    }
  }

  showDeleteConfirm(item: any): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure delete this User?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.userDelete(item),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  async userDelete(item: any) {
    this.loading = true
    try {
      await this.employeeService.updateEmployee({id: item._id, archived: true, type: 'DELETE'})
      this.notification.success('Success', `User delete successfully!`);
      await this.loadTableData()
    } catch (e) {
      console.error(e)
      this.notification.error('Error', 'Failed to update users. Please try again.',);
    } finally {
      this.loading = false
    }
  }
}
