import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    email = '';
    password = '';

  constructor(public authService: AuthService) { }

  ngOnInit() {

  }

  onSubmit(){
    this.authService.loginUser(this.email, this.password);
  }

}
