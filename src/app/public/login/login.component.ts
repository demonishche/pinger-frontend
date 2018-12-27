import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AuthService, authState } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('loginFormComponent') loginFormComponent;
  public loginForm: FormGroup;
  public fields: { name: string, defaultValue?: string, validation?: ValidatorFn[], errors?: {} }[] = [
    { name: 'username', validation: [Validators.required, Validators.maxLength(255)], errors: { required: 'You forgot to enter username', maxLength: 'Max length 255 symbols.' } },
    { name: 'password', validation: [Validators.required, Validators.maxLength(255)], errors: { required: 'You forgot to enter password', maxLength: 'Max length 255 symbols.' } }
  ];
  public globalErrors = {};
  public errorMessages = { username: '', password: '' };
  public formState: authState = authState.CREATING;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({});
  }

  ngAfterViewInit() {
    this.authService.authState.subscribe(state => this.formState = state);
    this.cdr.detectChanges();
  }

  submit() {
    this.loginFormComponent.submit();
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password);
    }
  }
}
