import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProject } from '../../services/projects/projects.service';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit {

  public project: IProject;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.project = data.projectInfo;
    });
  }

}
