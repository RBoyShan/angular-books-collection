import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/shared/services/user-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/validators/validators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public hide: boolean = true;
  public usernameForm: FormGroup;
  public emailForm: FormGroup;
  public passwordForm: FormGroup;
  public matcher = new MyErrorStateMatcher();

  constructor(
    private auth: UserAuthService,
    private builder: FormBuilder
  ) { }

  public signUp(email: string, password: string, username: string) {
    console.log(email, password, username)
    this.auth.signUp(email, password, username);
    setTimeout(() => {
      window.location.reload();
    },2000)
  }

  public signInGoogle() {
    this.auth.signInGoogle();
  }

  public passwordValidator(form: FormGroup) { 
    const condition = form.controls.passwordCtrl.value === form.controls.confirmCtrl.value;
    return condition ? null : {'passwordDoNotMatch': true};
  }

  private usernameFormInit() {
    this.usernameForm = this.builder.group({
      usernameCtrl: ['', [ Validators.minLength(4)]]
    });
  }

  private emailFormInit() {
    this.emailForm = this.builder.group({
      emailCtrl: ['', [ Validators.email]]
    });
  }

  private passwordFormInit() {
    this.passwordForm = this.builder.group({
      passwordCtrl: ['', [ Validators.minLength(6)]],
      confirmCtrl: ['']
    }, {validators: [this.passwordValidator]})
  }

  ngOnInit(): void {
    this.usernameFormInit();
    this.emailFormInit();
    this.passwordFormInit();
  }

}
