import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveComponent } from '../../components/leave/leave.component';
import { AddEditLeaveComponent } from '../../components/leave/add-edit-leave/add-edit-leave.component'


const routes: Routes = [
 {
        path: '',
        component: LeaveComponent,
      },
      {
        path: 'add-edit',
        component: AddEditLeaveComponent
      },
      {
        path: 'add-edit/:id',
        component: AddEditLeaveComponent
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }
