import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { requestState, ProjectsService } from '../../services/projects/projects.service';

@Component({
  selector: 'app-remove-project',
  templateUrl: './remove-project.component.html',
  styleUrls: ['./remove-project.component.scss']
})
export class RemoveProjectComponent implements OnInit {

  @ViewChild('removeProjectFormComponent') removeProjectFormComponent;
  public removeProjectForm: FormGroup;
  public fields: { name: string, defaultValue?: string, validation?: ValidatorFn[], errors?: {} }[] = [
    { name: 'projectName', validation: [Validators.required, Validators.maxLength(255)], errors: { required: 'You forgot to enter project name', maxLength: 'Max length 255 symbols.', notMatch: 'Project name not match.' } }
  ];
  public globalErrors = {};
  public errorMessages = { projectName: '' };
  public formState: requestState = requestState.CREATING;

  private name: string = '';
  private project_id: string;

  constructor(
    private projectService: ProjectsService
  ) { }

  ngOnInit() {
    this.removeProjectForm = new FormGroup({});

    this.projectService.removeProjectState.subscribe(state => {
      this.formState = state.state;

      switch (state.state) {
        case requestState.SUCCESS:
          this.removeProjectForm.reset();
          break;
      }
    });
  }

  submit() {
    this.removeProjectFormComponent.submit();
    if (this.name !== this.removeProjectForm.value.projectName) {
      this.setFieldError('projectName', 'notMatch')
    }
    if (this.removeProjectForm.valid) {
      this.projectService.removeProject(this.project_id);
    }
  }

  public setProjectInfo(_project_id, _name): void {
    this.name = _name;
    this.project_id = _project_id;
  }

  private setFieldError(field, error) {
    let errors = {};
    errors[error] = true;
    this.removeProjectFormComponent.setError(this.removeProjectForm.controls[field], errors);
  }
}
