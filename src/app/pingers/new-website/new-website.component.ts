import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { PingersService, requestState } from 'src/app/services/pingers/pingers.service';

@Component({
  selector: 'app-new-website',
  templateUrl: './new-website.component.html',
  styleUrls: ['./new-website.component.scss']
})
export class NewWebsiteComponent implements OnInit {

  @ViewChild('newWebsiteFormComponent') newWebsiteFormComponent;
  public newWebsiteForm: FormGroup;
  public fields: { name: string, defaultValue?: string, validation?: ValidatorFn[], errors?: {} }[] = [
    { name: 'pageName', validation: [Validators.required, Validators.maxLength(255)], errors: { required: 'You forgot to enter new page name', maxLength: 'Max length 255 symbols.' } },
    {
      name: 'pingerUrl',
      validation: [Validators.required, Validators.maxLength(255), Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)],
      errors: { required: 'You forgot to enter page url', maxLength: 'Max length 255 symbols.', pattern: 'Incorrect url.' }
    }
  ];
  public globalErrors = {};
  public errorMessages = { pageName: '', pingerUrl: '' };
  public formState: requestState = requestState.CREATING;
  private project_id: string;

  constructor(
    private pingersService: PingersService
  ) { }

  ngOnInit() {
    this.newWebsiteForm = new FormGroup({});

    this.pingersService.newPingerState.subscribe(state => {
      this.formState = state.state;

      switch (state.state) {
        case requestState.SUCCESS:
          this.newWebsiteForm.reset();
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
    this.newWebsiteFormComponent.submit();
    if (this.newWebsiteForm.valid) {
      this.pingersService.createNewWebsitePinger(this.project_id, this.newWebsiteForm.value.pageName, this.newWebsiteForm.value.pingerUrl);
    }
  }

  public setProjectId(_project_id): void {
    this.project_id = _project_id;
  }

  private setFieldError(field, error) {
    const keys = { name: 'pageName', url: 'pingerUrl' };
    let errors = {};
    errors[error] = true;
    field = keys[field];

    if (this.newWebsiteForm.controls[field])
      this.newWebsiteFormComponent.setError(this.newWebsiteForm.controls[field], errors);
  }
}
