import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Subscription } from 'rxjs';
import { Profile } from '../profile/profile.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  public profile: Profile = {
    username: '',
    email: '',
    password: '',
    avatarUrl: ''
  }
  password = '';
  newPass1 = '';
  newPass2 = '';
  public inputUsername = localStorage.getItem('username');
  public changePass = false;
  public passedVeri = false;
  private profileSub: Subscription;
  constructor(public profileService: ProfileService,
    private router: Router,
    public authService: AuthService) { };
  public currentUser = localStorage.getItem('username');
  ngOnInit() {
    this.profileService.getMyProfile(this.currentUser);
    this.profileSub = this.profileService.getMyProfileUpdateListener()
      .subscribe((profile: Profile) => {
        this.profile = profile;
      });
  }
  ngOnDestroy() {
    this.profileSub.unsubscribe();
  }
  onSubmit() {
    //update the new password
    if (this.newPass1 != this.newPass2)
      alert("Two passwords must match!");
    else {
      this.profileService.updatePassword(this.currentUser, this.newPass2)
        .subscribe(() => {
          alert("Password Updated");
          this.router.navigate(['/profile']);

        }, err => {
          if (err.status === 500) {
            alert('Server Error!');
          } else if (err.status === 401) {
            alert('Please use another password!');
          }
        });
    }


  }
  changePassword() {
    this.changePass = true;
  }
  // verify if the password is correct
  passwordVeri() {
    this.profileService.verifyPassword(this.currentUser, this.password)
      .subscribe(() => {
        this.passedVeri = true;
      }, err => {
        if (err.status === 500) {
          alert('Server Error!');
        } else if (err.status === 401) {
          alert('Invalid password!');

        }
      });
  }
}
