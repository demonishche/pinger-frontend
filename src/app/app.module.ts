import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule } from './routing/routing.module';
import { PublicModule } from './public/public.module';
import { PrivateModule } from './private/private.module';
import { httpInterceptorProviders } from './services/http-interceptors';
import { ProjectsModule } from './projects/projects.module';
import { PingersModule } from './pingers/pingers.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    PublicModule,
    PrivateModule,
    ProjectsModule,
    PingersModule,
    ServiceWorkerModule.register('sw-index.js', { enabled: environment.production })
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
