import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { requestState, ProjectsService } from '../../services/projects/projects.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, AfterViewInit {

  @ViewChild('newProjectFormComponent') newProjectFormComponent;
  public newProjectForm: FormGroup;
  public fields: { name: string, defaultValue?: string, validation?: ValidatorFn[], errors?: {} }[] = [
    { name: 'projectName', validation: [Validators.required, Validators.maxLength(255)], errors: { required: 'You forgot to enter new project name', maxLength: 'Max length 255 symbols.', unique: 'Project name can`t duplicate.' } },
    {
      name: 'projectOrigin',
      validation: [Validators.required, Validators.maxLength(255), Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)],
      errors: { required: 'You forgot to enter project origin', maxLength: 'Max length 255 symbols.', pattern: 'Incorrect origin.', unique: 'Project origin can`t duplicate.' }
    }
  ];
  public globalErrors = {};
  public errorMessages = { projectName: '', projectOrigin: '' };
  public formState: requestState = requestState.CREATING;

  constructor(
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.newProjectForm = new FormGroup({});
  }

  ngAfterViewInit() {
    this.projectsService.newProjectState.subscribe(state => {
      this.formState = state.state;

      switch (state.state) {
        case requestState.SUCCESS:
          this.newProjectForm.reset();
          break;
        case requestState.FAILED:
          state.errors.forEach(item => {
            this.setFieldError(item.param, item.msg);
          });
          break;
      }
    });
  }

  submit() {
    this.newProjectFormComponent.submit();
    if (this.newProjectForm.valid) {
      const {projectName, projectOrigin} = this.newProjectForm.value;
      this.projectsService.createNewProject(projectName, projectOrigin);
    }
  }

  private setFieldError(field, error) {
    let errors = {};
    errors[error] = true;

    if (this.newProjectForm.controls[field])
      this.newProjectFormComponent.setError(this.newProjectForm.controls[field], errors);
  }
}
