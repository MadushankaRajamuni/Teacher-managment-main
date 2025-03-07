import {Component, HostListener, OnInit} from '@angular/core';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NgClass} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NzImageDirective, NzImageModule} from "ng-zorro-antd/image";
import {UserService} from '../core/services/user.service';
import {AuthService} from '../modules/auth/services/auth.service';
import {UnderscoreToSpaceAndCamelCasePipe} from '../core/pipes/underscore-to-space-and-camel-case.pipe';
import {NzDropDownDirective, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-layout',
  imports: [NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule, NgClass, RouterOutlet, NzImageDirective, NzImageModule, UnderscoreToSpaceAndCamelCasePipe, NzDropdownMenuComponent, NzDropDownDirective],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true
})
export class LayoutComponent implements OnInit{
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  isCollapsed = false;

  paths = [
    {
      name: "DASHBOARD",
      path: "/admin/dashboard"
    },
    {
      name: "USERS",
      path: "/admin/users"
    },
    {
      name: "USER_ADD",
      path: "/admin/users/add-edit"
    },
    {
      name: "DEPART",
      path: "/admin/departments"
    },
    {
      name: "DEPART_ADD",
      path: "/admin/departments/add-edit"
    },
    {
      name: "EMPLOYEE",
      path: "/admin/employees"
    },
    {
      name: "EMPLOYEE_ADD",
      path: "/admin/employees/add-edit"
    },
    {
      name: "LOGS",
      path: "/admin/logs"
    }
  ]
  loggedInUser: any;
  openSubmenu: number | null = null;

  constructor(protected router: Router,
              private userService: UserService,
              private authService: AuthService) {}

  ngOnInit() {
    this.router.isActive(this.routeLinkActive('DASHBOARD') || '', true)
    this.getLoggedInUserDetails()
  }
  checkScreenWidth() {
    const screenWidth = window.innerWidth;
    this.isCollapsed = screenWidth <= 640;
  }

  toggleSubmenu(submenu: number, open: boolean): void {
    this.openSubmenu = open ? submenu : null;
  }

  routeLink(type: string) {
    const route = this.paths.find(ro => ro.name === type);
    if (route) {
      this.router.navigate([route.path]);
    }
  }

  routeLinkActive(type: string) {
    const route = this.paths.find(ro => ro.name === type);
    return route?.path || ''
  }

  async getLoggedInUserDetails(): Promise<void> {
    try {
      const user = this.authService.getLoggedInUser()
      this.loggedInUser = await this.userService.userDetailsById(user?.userId)
    } catch (e) {
      console.error('Error creating user:', e);
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

}
