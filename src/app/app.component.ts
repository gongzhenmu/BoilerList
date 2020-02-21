import { Component, OnInit,Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Post } from './posts/post.model';
import * as $ from 'jquery';

import {AuthService} from './auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  currentTheme: string = 'minty';
  title = 'Twister';
  search: string;
  private authListener: Subscription;
  isAuth = false;


  constructor(public auth: AuthService, public router: Router,  private renderer: Renderer2, @Inject(DOCUMENT) private document) { }

  ngOnInit() {
    const cacheTheme = localStorage.getItem('currentTheme');
    if (cacheTheme) {
      this.theme(cacheTheme);
    }
    this.authListener = this.auth.getAuthStatusListener().subscribe(authState => {
      this.isAuth = authState;
    });


  }

  theme(type) {
      this.renderer.removeClass(document.body, 'theme-'+this.currentTheme);
      this.currentTheme = type;
      localStorage.setItem('currentTheme', this.currentTheme);
      this.renderer.addClass(document.body, 'theme-'+ this.currentTheme);
      this.document.getElementById('theme').href = '/assets/theme/bootstrap.' + type + '.css';
  }

  logout() {
    this.auth.logout();
  }




}
