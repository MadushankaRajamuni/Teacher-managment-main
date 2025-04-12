import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form'; 
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LeaveRoutingModule } from './leave-routing.module';
import { AddEditLeaveComponent } from '../../components/leave/add-edit-leave/add-edit-leave.component';
import { LeaveComponent } from '../../components/leave/leave.component';
import { RouterModule } from '@angular/router'; 
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    LeaveRoutingModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDatePickerModule,
    NzFormModule,
    RouterModule,
    LeaveComponent,
    NzInputModule, 
  ],
  exports: [

  ],
})
export class LeaveModule { }
