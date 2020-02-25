import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../posts/post.model';
import { ProfileService } from './profile.service';
import {Profile} from './profile.model';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit,  OnDestroy {
  posts: Post[] = [];
  public profile: Profile = {
    username: '',
    email: ''
  }
  private postsSub: Subscription;
  private profileSub: Subscription;
  constructor(public profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getMyPosts();
    this.postsSub = this.profileService.getMyPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts  =  posts;
      });
    this.profileService.getMyProfile();
    this.profileSub = this.profileService.getMyProfileUpdateListener()
      .subscribe((profile: Profile) => {
        this.profile  =  profile;
      });
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.profileSub.unsubscribe();
  }

  onDelete(postId: string){
    this.profileService.deletePost(postId);
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
  }
}
