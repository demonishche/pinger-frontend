import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit {

  @Input('form') form: FormGroup;
  @Input('fields') fields: { name: string, defaultValue?: string, validation?: ValidatorFn[], errors?: {} }[];
  @Input() globalErrors: {};
  @Input('errorMessages') errorMessages: {};
  public errors: {} = {};

  constructor() { }

  ngOnInit() {
    this.fields.forEach((item) => {
      this.form.addControl(item.name, new FormControl(item.defaultValue || '', { updateOn: 'blur', validators: item.validation }));
      this.errors[item.name] = item.errors;
    });

    this.form.valueChanges.subscribe(() => {
      this.checkForms();
    });

  }

  checkForms() {
    for (const key in this.form.controls) {
      this.checkError(key, this.form.controls[key].errors);
    }
  }

  checkError(control: string, errors) {
    if (!errors) {
      this.errorMessages[control] = '';
      return false;
    }
    const key = Object.keys(errors)[0];
    this.errorMessages[control] = '';

    if (!!this.errors[control]) {
      if (!!this.errors[control][key]) {
        this.errorMessages[control] = this.errors[control][key];
      }
    }

    if (!!this.globalErrors[key] && !this.errorMessages[control]) {
      this.errorMessages[control] = this.globalErrors[key];
    } else if (!this.errorMessages[control]) {
      this.errorMessages[control] = 'Error!';
    }
  }

  setError(control: FormControl, errors: {}) {
    control.setErrors(errors);
    control.markAsDirty();
    control.markAsTouched();
    this.form.updateValueAndValidity();
  }

  submit() {
    this.updateControls();
    this.setControlsTouchebleAndDirty();
    this.checkForms();
  }

  private setControlsTouchebleAndDirty() {
    for (const key in this.form.controls) {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].markAsTouched();
    }
  }

  private updateControls() {
    for (const key in this.form.controls) {
      this.form.controls[key].updateValueAndValidity();
    }
  }

}
