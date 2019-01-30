import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService, IProject, requestState } from '../../services/projects/projects.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {

  @ViewChild('removeProjectForm') removeProjectFormComponent;
  @ViewChild('editProjectForm') editProjectFormComponent;
  public projects: IProject[] = [];
  public newProjectModalVisibility: boolean = false;
  public removeProjectModalVisibility: boolean = false;
  public editProjectModalVisibility: boolean = false;

  constructor(
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.projectsService.getList().subscribe(_projects => this.projects = _projects);
  }

  public showNewProjectModal(): void {
    this.newProjectModalVisibility = true;
    this.projectsService.newProjectState.next({state:requestState.CREATING});
  }

  public closeNewProjectModal(event, close = false): void {
    if ((!!event && event.target.className.indexOf('modalContainer') !== -1) || close) {
      this.newProjectModalVisibility = false;
    }
  }

  public removeProject(project_id: string, name: string): void {
    this.removeProjectFormComponent.setProjectInfo(project_id, name);
    this.showRemoveProjectModal();
  }

  public showRemoveProjectModal(): void {
    this.removeProjectModalVisibility = true;
    this.projectsService.removeProjectState.next({state:requestState.CREATING});
  }

  public closeRemoveProjectModal(event, close = false): void {
    if ((!!event && event.target.className.indexOf('modalContainer') !== -1) || close) {
      this.removeProjectModalVisibility = false;
    }
  }

  public editProject(project_id: string, name: string, origin: string): void {
    this.editProjectFormComponent.setProjectInfo(project_id, name, origin);
    this.showEditProjectModal();
  }

  public showEditProjectModal(): void {
    this.editProjectModalVisibility = true;
    this.projectsService.editProjectState.next({state:requestState.CREATING});
  }

  public closeEditProjectModal(event, close = false): void {
    if ((!!event && event.target.className.indexOf('modalContainer') !== -1) || close) {
      this.editProjectModalVisibility = false;
    }
  }
}
