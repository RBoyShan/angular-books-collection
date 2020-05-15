import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/shared/services/user-auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  public currentUser = this.auth.user;

  constructor(
    private auth: UserAuthService
  ) { }

  public verify() {
    this.auth.sendVerificationMail();
  }

  ngOnInit(): void {
  }

}
