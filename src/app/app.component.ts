import { Component, OnInit,Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router'
import { Post } from './posts/post.model';
import * as $ from 'jquery';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  currentTheme: string = 'minty';
  title = 'Twister';
  search: string;

  constructor(public router: Router,  private renderer: Renderer2, @Inject(DOCUMENT) private document) { }

  ngOnInit() {
    const cacheTheme = localStorage.getItem("currentTheme")
    if (cacheTheme) {
      this.theme(cacheTheme);
    }
  }

  theme(type) {
      this.renderer.removeClass(document.body, 'theme-'+this.currentTheme);
      this.currentTheme = type;
      localStorage.setItem("currentTheme", this.currentTheme);
      this.renderer.addClass(document.body, 'theme-'+this.currentTheme);
      this.document.getElementById('theme').href = '/assets/theme/bootstrap.'+type+'.css';
  }

}