import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PingersListComponent } from './pingers-list/pingers-list.component';
import { PrivatePageComponent } from './private-page/private-page.component';
import { SharedModule } from '../shared/shared.module';
import { NewWebsiteComponent } from './new-website/new-website/new-website.component';
import { RemoveWebsiteComponent } from './remove-website/remove-website.component';

@NgModule({
  declarations: [PingersListComponent, PrivatePageComponent, NewWebsiteComponent, RemoveWebsiteComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PrivateModule { }
