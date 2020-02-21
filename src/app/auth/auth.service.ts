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


  // -------------------login-----------------
  loginUser(email: string, password: string) {
    this.http.post<{ token: string }>(this.loginUserURL, { email: email, password: password })
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    }, err => {
      if (err.status === 400) {
          alert('Please fill in all blanks');
      } else if (err.status === 500) {
          alert('Server error');
      } else if (err.status === 403) {
          alert('No such user');
      } else if (err.status === 401) {
          alert('Wrong password');
    }
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }


  private saveAuthData(token: string) {
    localStorage.setItem('token', token);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');

    if (!token ) {
      return;
    }
    return { token: token }
  }





}
