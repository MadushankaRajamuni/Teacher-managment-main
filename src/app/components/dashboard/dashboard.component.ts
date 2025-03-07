import { Component } from '@angular/core';
import {BreadcrumbComponent} from "../common/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-dashboard',
    imports: [
        BreadcrumbComponent
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true
})
export class DashboardComponent {
  breadcrumbs: any[] = [
    {
      name: "Home",
      path: "/admin/dashboard"
    },
    {
      name: "Dashboard",
      path: "/admin/dashboard"
    }
  ];
}
