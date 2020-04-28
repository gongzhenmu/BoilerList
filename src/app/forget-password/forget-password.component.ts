import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  constructor( private ps: ProfileService, private router: Router, ) { }
  email ='';

  ngOnInit() {
  }

  sendEmail(){
    if(this.email == ''){
      alert("email cannot be empty");
      return;
    }
    console.log(this.email);
    this.ps.forgetPassword(this.email).subscribe(() => {
      alert("Email sent");
      this.router.navigate(['/login']);
    }, err => {
      if (err.status === 401) {
        alert('Email does not exist! Please register first!');
      } else {
        alert('Error occurs. Email not sent');
      }
    });
  }

}
