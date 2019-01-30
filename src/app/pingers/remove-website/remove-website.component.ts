import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { requestState, PingersService } from 'src/app/services/pingers/pingers.service';

@Component({
  selector: 'app-remove-website',
  templateUrl: './remove-website.component.html',
  styleUrls: ['./remove-website.component.scss']
})
export class RemoveWebsiteComponent implements OnInit {

  @ViewChild('removeWebsiteFormComponent') removeWebsiteFormComponent;
  public removeWebsiteForm: FormGroup;
  public fields: { name: string, defaultValue?: string, validation?: ValidatorFn[], errors?: {} }[] = [
    { name: 'websiteName', validation: [Validators.required, Validators.maxLength(255)], errors: { required: 'You forgot to enter new website name', maxLength: 'Max length 255 symbols.', notMatch: 'Website name not match.' } }
  ];
  public globalErrors = {};
  public errorMessages = { websiteName: '', pingerUrl: '' };
  public formState: requestState = requestState.CREATING;
  private id: string = '';
  private name: string = '';
  private project_id: string;

  constructor(
    private pingersService: PingersService
  ) { }

  ngOnInit() {
    this.removeWebsiteForm = new FormGroup({});

    this.pingersService.removePingerState.subscribe(state => {
      this.formState = state.state;

      switch (state.state) {
        case requestState.SUCCESS:
          this.removeWebsiteForm.reset();
          break;
      }
    });
  }

  submit() {
    this.removeWebsiteFormComponent.submit();
    if (this.name !== this.removeWebsiteForm.value.websiteName) {
      this.setFieldError('websiteName', 'notMatch')
    }
    if (this.removeWebsiteForm.valid) {
      this.pingersService.removePinger(this.project_id, this.id);
    }
  }

  public setPingerInfo(_project_id, _name, _id): void {
    this.name = _name;
    this.id = _id;
    this.project_id = _project_id;
  }

  private setFieldError(field, error) {
    let errors = {};
    errors[error] = true;
    this.removeWebsiteFormComponent.setError(this.removeWebsiteForm.controls[field], errors);
  }
}
