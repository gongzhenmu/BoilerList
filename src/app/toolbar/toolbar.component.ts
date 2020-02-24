import { Component,  OnDestroy , OnInit , Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import {AuthService} from '../auth/auth.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'

})
export class ToolbarComponent implements OnInit, OnDestroy {

  isAuth = false;
  private authListenerSubs: Subscription;


  currentTheme: string = 'minty';
  title = 'Twister';
  search: string;

  constructor(private authService: AuthService,  private renderer: Renderer2, @Inject(DOCUMENT) private document) {}



  ngOnInit() {
    const cacheTheme = localStorage.getItem('currentTheme');
    if (cacheTheme) {
      this.theme(cacheTheme);
    }
    this.isAuth = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isAuth = isAuthenticated;
      });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  theme(type) {
    this.renderer.removeClass(document.body, 'theme-' + this.currentTheme);
    this.currentTheme = type;
    localStorage.setItem('currentTheme', this.currentTheme);
    this.renderer.addClass(document.body, 'theme-' + this.currentTheme);
    this.document.getElementById('theme').href = '/assets/theme/bootstrap.' + type + '.css';
 }




}
