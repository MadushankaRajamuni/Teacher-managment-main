import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DepartmentComponent} from '../../components/department/department.component';
import {
  AddEditDepartmentComponent
} from '../../components/department/add-edit-department/add-edit-department.component';

const routes: Routes = [
  {
    path: '',
    component: DepartmentComponent,
  },
  {
    path: 'add-edit',
    component: AddEditDepartmentComponent,
  },
  {
    path: 'add-edit/:id',
    component: AddEditDepartmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
