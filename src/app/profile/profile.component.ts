import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../posts/post.model';
import { ProfileService } from './profile.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit,  OnDestroy {
  username = localStorage.getItem('username');
  email = localStorage.getItem('email');
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getMyPosts();
    this.postsSub = this.profileService.getMyPostsUpdateListener()
      .subscribe((posts: Post[])=> {
        this.posts  =  posts;
      });
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string){
    this.profileService.deletePost(postId);
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
  }
}
