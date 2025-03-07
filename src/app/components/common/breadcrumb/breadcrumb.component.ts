import {Component, Input} from '@angular/core';
import {NzBreadCrumbComponent, NzBreadCrumbItemComponent} from 'ng-zorro-antd/breadcrumb';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
    RouterLink
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  standalone: true
})
export class BreadcrumbComponent {
  @Input() crumbs: any[] = [];
}
