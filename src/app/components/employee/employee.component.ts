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

@Component({
  selector: 'app-employee',
  imports: [
    BreadcrumbComponent,
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
    TruncateTextPipe
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
  standalone: true
})
export class EmployeeComponent implements OnInit {
  breadcrumbs: any[] = [
    {
      name: "Home",
      path: "/admin/dashboard"
    },
    {
      name: "Employee",
      path: "/admin/employees"
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
              private employeeService: EmployeeService,) {
  }

  ngOnInit() {
    Promise.all([ this.loadDepartsData(), this.loadTableData()], )
  }


  async loadDepartsData(): Promise<void> {
    this.depLoading = true
    try {
      const response = await this.departService.getActiveDeparts()
      this.departments = response
    } catch (e: any) {
      console.error(e)
    } finally {
      this.depLoading = false
    }
  }

  async loadTableData(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.employeeService.getPagedEmployee({
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
      nzTitle: 'Are you sure delete this Employee?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.empDelete(item),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  async empDelete(item: any) {
    this.loading = true
    try {
      await this.employeeService.updateEmployee({id: item._id, archived: true, type: 'DELETE'})
      this.notification.success('Success', `Employee delete successfully!`);
      await this.loadTableData()
    } catch (e) {
      console.error(e)
      this.notification.error('Error', 'Failed to update employee. Please try again.',);
    } finally {
      this.loading = false
    }
  }
}
