import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EmployeeComponent} from '../../components/employee/employee.component';
import {AddEditEmployeeComponent} from '../../components/employee/add-edit-employee/add-edit-employee.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
  },
  {
    path: 'add-edit',
    component: AddEditEmployeeComponent,
  },
  {
    path: 'add-edit/:id',
    component: AddEditEmployeeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
