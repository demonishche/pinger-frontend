import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { SharedModule } from '../shared/shared.module';
import { NewProjectComponent } from './new-project/new-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { RemoveProjectComponent } from './remove-project/remove-project.component';
import { ProjectInfoResolver } from '../services/resolvers/project-info.resolver';

@NgModule({
  declarations: [
    ProjectsListComponent,
    ProjectsPageComponent,
    NewProjectComponent,
    EditProjectComponent,
    RemoveProjectComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    ProjectInfoResolver
  ]
})
export class ProjectsModule { }
