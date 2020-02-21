import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

// private _checkUrl = 'http://localhost:3000/api/checkUserNameAndEmail';
  private loginUserURL = 'http://localhost:3000/api/login';
  private createUserURL = 'http://localhost:3000/api/register';
  private deleteAccountURL = 'http://localhost:3000/api/delete';
  private checkUsernameAvailability = 'http://localhost:3000/api/register/checkUsername';
  private checkEmailAvailability = 'http://localhost:3000/api/register/checkEmail';

  constructor(private http: HttpClient, private router: Router) { }
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(user) {
    return this.http.post<any>(this.createUserURL, user);
  }
  deleteAccount() {
    return this.http.post<any>(this.deleteAccountURL, {});
  }
  usernameAvailablility(username) {
    return this.http.post<any>(this.checkUsernameAvailability, {username});
  }
  emailAvailibility(email) {
    return this.http.post<any>(this.checkEmailAvailability, {email});
  }


  // login
  loginUser(email: string, password: string) {
     this.http.post<any>(this.loginUserURL, { email: email, password: password });
  }

}
