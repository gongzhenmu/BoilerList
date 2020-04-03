import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private username: string;

// private _checkUrl = 'http://localhost:3000/api/checkUserNameAndEmail';
  private loginUserURL = environment.apiUrl + '/login';
  private createUserURL = environment.apiUrl + '/register';
  private deleteAccountURL = environment.apiUrl + '/delete';
  private checkUsernameAvailability = environment.apiUrl + '/register/checkUsername';
  private checkEmailAvailability = environment.apiUrl + '/register/checkEmail';

  constructor(private http: HttpClient, private router: Router) { }
  getToken() {
    return this.token;
  }
  getUsername() {
    return this.username;
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
    this.http.post<{ token: string, username: string }>(this.loginUserURL, { email: email, password: password })
    .subscribe(response => {
      const token = response.token;
      const username = response.username;
      this.token = token;
      this.username = username;

      if (token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.saveAuthData(token, username, email);
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
    this.username = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }


  private saveAuthData(token: string, username: string, email: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
      return;
    }
    return { token: token, username: username };
  }

  autoAuth() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    this.token = authData.token;
    this.username = authData.username;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);

  }





}
