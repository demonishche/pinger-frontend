import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService, IBreadcrumb } from 'src/app/services/breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  public breadcrumbs: IBreadcrumb[] = [];

  constructor(
    private breadcrumbService: BreadcrumbsService
  ) { }

  ngOnInit() {
    this.breadcrumbService.breadcrumbSubject.subscribe(_breadcrumbs => this.breadcrumbs = _breadcrumbs);
  }

}
