import { Component } from '@angular/core';
import {BreadcrumbComponent} from '../common/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-user',
  imports: [BreadcrumbComponent],
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
}
