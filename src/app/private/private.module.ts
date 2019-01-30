import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivatePageComponent } from './private-page/private-page.component';
import { SharedModule } from '../shared/shared.module';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [
    PrivatePageComponent,
    BreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PrivateModule { }
