import { Component, OnInit, ViewChild, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { PingersService, newPingerState } from 'src/app/services/pingers/pingers.service';

@Component({
  selector: 'app-new-website',
  templateUrl: './new-website.component.html',
  styleUrls: ['./new-website.component.scss']
})
export class NewWebsiteComponent implements OnInit, AfterViewInit {

  @ViewChild('newWebsiteFormComponent') newWebsiteFormComponent;
  public newWebsiteForm: FormGroup;
  public fields: { name: string, defaultValue?: string, validation?: ValidatorFn[], errors?: {} }[] = [
    { name: 'websiteName', validation: [Validators.required, Validators.maxLength(255)], errors: { required: 'You forgot to enter new website name', maxLength: 'Max length 255 symbols.' } },
    {
      name: 'pingerUrl',
      validation: [Validators.required, Validators.maxLength(255), Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)],
      errors: { required: 'You forgot to enter website url', maxLength: 'Max length 255 symbols.', pattern: 'Incorrect url.' }
    }
  ];
  public globalErrors = {};
  public errorMessages = { websiteName: '', pingerUrl: '' };
  public formState: newPingerState = newPingerState.CREATING;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private pingersService: PingersService
  ) { }

  ngOnInit() {
    this.newWebsiteForm = new FormGroup({});
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId))
      return;

    this.pingersService.newPingerState.subscribe(state => {
      this.formState = state.state;

      switch (state.state) {
        case newPingerState.SUCCESS:
          this.newWebsiteForm.reset();
          break;
        case newPingerState.FAILED:
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
      this.pingersService.createNewWebsitePinger(this.newWebsiteForm.value.websiteName, this.newWebsiteForm.value.pingerUrl);
    }
  }

  private setFieldError(field, error) {
    let errors = {};
    errors[error] = true;
    this.newWebsiteFormComponent.setError(this.newWebsiteForm.controls[field], errors);
  }
}
