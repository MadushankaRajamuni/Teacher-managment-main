import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from '../../common/breadcrumb/breadcrumb.component';
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
import {SETTINGS} from '../../../core/config/common.settings';
import {DepartmentService} from '../../../core/services/department.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzModalModule, NzModalService} from 'ng-zorro-antd/modal';
import {EmployeeService} from '../../../core/services/employee.service';
import {NzImageDirective, NzImageModule} from 'ng-zorro-antd/image';
import {TruncateTextPipe} from '../../../core/pipes/truncate-text.pipe';
import {UserService} from '../../../core/services/user.service';

@Component({
  selector: 'app-non-acadamic',
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
  templateUrl: './non-acadamic.component.html',
  styleUrl: './non-acadamic.component.scss'
})
export class NonAcadamicComponent {
  breadcrumbs: any[] = [
    {
      name: "Home",
      path: "/admin/dashboard"
    },
    {
      name: "Non-Acadamic Employees",
      path: "/admin/non-acadamic"
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
    const response = await this.userService.getPagedUsers({
      filters: {
        status: this.status,
        searchTerm: this.searchTerm,
        depart: this.depart,
      },
      pageIndex: 0,  
      pageSize: 1000, 
      sortOrder: this.sortOrder,
    });

    const pagedData = response as any;
    this.tableData = pagedData.users.filter((user: any) =>
      user.role?.name === 'CLERK'
    );
    this.totalRecords = this.tableData.length;
  } catch (e) {
    console.error(e);
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
