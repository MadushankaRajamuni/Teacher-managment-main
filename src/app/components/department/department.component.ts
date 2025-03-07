import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from '../common/breadcrumb/breadcrumb.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {NzTableComponent, NzThMeasureDirective} from 'ng-zorro-antd/table';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {DatePipe} from '@angular/common';
import {DepartmentService} from '../../core/services/department.service';
import {FormsModule} from '@angular/forms';
import {NzPaginationComponent} from 'ng-zorro-antd/pagination';
import {NzSwitchComponent} from 'ng-zorro-antd/switch';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {RouterLink} from '@angular/router';
import {NzModalModule, NzModalService} from 'ng-zorro-antd/modal';
import {SETTINGS} from '../../core/config/common.settings';

@Component({
  selector: 'app-department',
  imports: [
    BreadcrumbComponent,
    NzButtonComponent,
    NzInputGroupComponent,
    NzSelectComponent,
    NzOptionComponent,
    NzInputDirective,
    NzSpinComponent,
    NzTableComponent,
    NzThMeasureDirective,
    NzIconDirective,
    DatePipe,
    FormsModule,
    NzPaginationComponent,
    NzSwitchComponent,
    RouterLink,
    NzModalModule
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
  standalone: true
})
export class DepartmentComponent implements OnInit {

  breadcrumbs: any[] = [
    {
      name: "Home",
      path: "/admin/dashboard"
    },
    {
      name: "Department",
      path: "/admin/departments"
    }
  ];
  loading = false
  tableData: any[] = []
  status: any = null
  searchTerm: any = ''
  sortOrder: number = -1;
  totalRecords: number = 0
  pageIndex: number = 1
  pageSize: number = SETTINGS.PAGE_SIZE


  constructor( private departService: DepartmentService,
               private notification: NzNotificationService,
               private modalService: NzModalService) {
  }

  ngOnInit() {
    Promise.all([ this.loadTableData()])

  }

  async loadTableData(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.departService.getPagedDepart({
        filters: {
          status: this.status,
          searchTerm: this.searchTerm,
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
     await this.departService.updateDepart({id: item._id, active: event})
     this.notification.success('Success', `Department update successfully!`);
     await this.loadTableData()
   } catch (e: any) {
     console.error(e)
   } finally {
     this.loading = false
   }
  }


  showDeleteConfirm(item: any): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure delete this Department?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.depDelete(item),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  async depDelete(item: any) {
    await this.departService.updateDepart({id: item._id, archived: true})
    this.notification.success('Success', `Department delete successfully!`);
    await this.loadTableData()
  }
}
