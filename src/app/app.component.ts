import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';


import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(public auth: AuthService, public router: Router) { }

  ngOnInit() {
    this.auth.autoAuth();
  }



}
