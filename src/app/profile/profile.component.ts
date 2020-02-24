import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Profile } from './profile.model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  profile: Profile[] = [];
  private profileSub: Subscription;

  constructor(public profileService: ProfileService) {}
 
  ngOnInit() {
    this.profileService.getProfile();
    this.profileSub = this.profileService.getProfileUpdateListener()
      .subscribe((profile: Profile[]) => {
        this.profile = profile;
      });
  }
  ngOnDestroy() {
    this.profileSub.unsubscribe();
  }

}
