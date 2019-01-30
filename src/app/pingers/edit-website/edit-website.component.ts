import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { requestState, PingersService } from 'src/app/services/pingers/pingers.service';

@Component({
  selector: 'app-edit-website',
  templateUrl: './edit-website.component.html',
  styleUrls: ['./edit-website.component.scss']
})
export class EditWebsiteComponent implements OnInit, AfterViewInit {

  @ViewChild('editWebsiteFormComponent') editWebsiteFormComponent;
  public editWebsiteForm: FormGroup;
  public fields: { name: string, defaultValue?: string, validation?: ValidatorFn[], errors?: {} }[] = [
    { name: 'websiteName', validation: [Validators.required, Validators.maxLength(255)], errors: { required: 'You forgot to enter new website name', maxLength: 'Max length 255 symbols.', unique: 'Name of website can`t duplicate.' } },
    {
      name: 'pingerUrl',
      validation: [Validators.required, Validators.maxLength(255), Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)],
      errors: { required: 'You forgot to enter website url', maxLength: 'Max length 255 symbols.', pattern: 'Incorrect url.', unique: 'Url of website can`t duplicate.' }
    }
  ];
  public globalErrors = {};
  public errorMessages = { websiteName: '', pingerUrl: '' };
  public formState: requestState = requestState.CREATING;
  private id: string;
  private project_id: string;

  constructor(
    private pingersService: PingersService
  ) { }

  ngOnInit() {
    this.editWebsiteForm = new FormGroup({});
  }

  ngAfterViewInit() {
    this.pingersService.editPingerState.subscribe(state => {
      this.formState = state.state;

      switch (state.state) {
        case requestState.SUCCESS:
          this.editWebsiteForm.reset();
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
    this.editWebsiteFormComponent.submit();
    if (this.editWebsiteForm.valid) {
      const { websiteName, pingerUrl } = this.editWebsiteForm.value;
      this.pingersService.editPinger(this.project_id, this.id, websiteName, pingerUrl);
    }
  }

  public setPingerInfo(_project_id, _id, _name, _url): void {
    this.id = _id;
    this.project_id = _project_id;
    this.editWebsiteForm.setValue({
      websiteName: _name,
      pingerUrl: _url
    })
  }

  private setFieldError(field, error) {
    const keys = { name: 'websiteName', url: 'pingerUrl' };
    let errors = {};
    errors[error] = true;
    field = keys[field];

    if (this.editWebsiteForm.controls[field])
      this.editWebsiteFormComponent.setError(this.editWebsiteForm.controls[field], errors);
  }
}
