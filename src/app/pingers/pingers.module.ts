import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PingersListComponent } from './pingers-list/pingers-list.component';
import { SharedModule } from '../shared/shared.module';
import { NewWebsiteComponent } from './new-website/new-website.component';
import { RemoveWebsiteComponent } from './remove-website/remove-website.component';
import { EditWebsiteComponent } from './edit-website/edit-website.component';
import { ErrorsListComponent } from './errors-list/errors-list.component';
import { PingerInfoResolver } from '../services/resolvers/pinger-info.resolver';

@NgModule({
  declarations: [
    PingersListComponent,
    NewWebsiteComponent,
    RemoveWebsiteComponent,
    EditWebsiteComponent,
    ErrorsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    PingerInfoResolver
  ]
})
export class PingersModule { }
