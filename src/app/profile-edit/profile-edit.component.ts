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
    password: ''
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
    this.router.navigate(['/profile']);
  }
  changePassword() {
    this.changePass = true;
  }

  passwordVeri(){
    this.passedVeri = true;
    // verify if the password is correct
  }
}
