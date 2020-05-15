import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/shared/services/user-auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/validators/validators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public isForgotPassword: boolean = false;
  public hide: boolean = true;      //Стан поля введення паролю;      
  public loginForm: FormGroup;      //Форма авторизації
  public resetForm: FormGroup;      //Форма для скидання паролю
  
  public matcher = new MyErrorStateMatcher(); 
  
  constructor(
    private auth: UserAuthService,
    private builder: FormBuilder
  ) { }

  public login(formData) {
    this.auth.signIn(formData.email, formData.password);
  }

  public loginGoogle() {
    this.auth.signInGoogle();
  }

  public checkForgot() {
    if(this.resetForm == null) {
      this.resetFormInit();
    }
    this.isForgotPassword = !this.isForgotPassword;
  }

  public resetPassword(form: FormGroup) {
    this.auth.forgotPassword(form.get('email').value);
    this.checkForgot();
  }

  private loginFormInit() {
    this.loginForm = this.builder.group({
      email: new FormControl('', [ 
           Validators.required,
           Validators.email,
       ]),
      password: new FormControl('', [
           Validators.required,
           Validators.minLength(6)
      ])
    }) 
  }

  private resetFormInit() {
    this.resetForm = this.builder.group({
      email: new FormControl('', [ 
        Validators.required,
        Validators.email,
      ])
    });
  }

  ngOnInit(): void {
    this.loginFormInit();
  }

}
