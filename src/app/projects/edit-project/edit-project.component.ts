import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { requestState, ProjectsService } from '../../services/projects/projects.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  @ViewChild('editProjectFormComponent') editProjectFormComponent;
  public editProjectForm: FormGroup;
  public fields: { name: string, defaultValue?: string, validation?: ValidatorFn[], errors?: {} }[] = [
    { name: 'projectName', validation: [Validators.required, Validators.maxLength(255)], errors: { required: 'You forgot to enter project name', maxLength: 'Max length 255 symbols.', unique: 'Name of website can`t duplicate.' } },
    {
      name: 'projectOrigin',
      validation: [Validators.required, Validators.maxLength(255), Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)],
      errors: { required: 'You forgot to enter project prigin', maxLength: 'Max length 255 symbols.', pattern: 'Incorrect url.', unique: 'Projects origin can`t duplicate.' }
    }
  ];
  public globalErrors = {};
  public errorMessages = { websiteName: '', pingerUrl: '' };
  public formState: requestState = requestState.CREATING;
  private project_id: string;

  constructor(
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.editProjectForm = new FormGroup({});

    this.projectsService.editProjectState.subscribe(state => {
      this.formState = state.state;

      switch (state.state) {
        case requestState.SUCCESS:
          this.editProjectForm.reset();
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
    this.editProjectFormComponent.submit();
    if (this.editProjectForm.valid) {
      const { projectName, projectOrigin } = this.editProjectForm.value;
      this.projectsService.editProject(this.project_id, projectName, projectOrigin);
    }
  }

  public setProjectInfo(_project_id, _name, _url): void {
    this.project_id = _project_id;
    this.editProjectForm.setValue({
      projectName: _name,
      projectOrigin: _url
    })
  }

  private setFieldError(field, error) {
    const keys = { name: 'projectName', url: 'projectOrigin' };
    let errors = {};
    errors[error] = true;
    field = keys[field];

    if (this.editProjectForm.controls[field])
      this.editProjectFormComponent.setError(this.editProjectForm.controls[field], errors);
  }
}
