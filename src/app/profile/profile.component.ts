import { Component, OnInit, OnDestroy,  ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit,  OnDestroy {
  posts: Post[] = [];
  public profile: Profile = {
    username: '',
    email: '',
    password: ''
  }
  private postsSub: Subscription;
  private profileSub: Subscription;
  constructor(private route: ActivatedRoute, public profileService: ProfileService) { };
  public otherUsername;
  public currentUser = localStorage.getItem('username');
  public currentUserPage: Boolean = false;

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        of(params.get('username'))
      )
    ).subscribe((d) => {
      this.otherUsername = d;
    });
    if(this.otherUsername == null){
      this.otherUsername = this.currentUser;
      this.currentUserPage = true;
    }

    this.profileService.getMyPosts();
    this.postsSub = this.profileService.getMyPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts  =  posts;
      });

    this.profileService.getMyProfile(this.otherUsername);
    this.profileSub = this.profileService.getMyProfileUpdateListener()
      .subscribe((profile: Profile) => {
        this.profile  =  profile;
      });
      this.profile.username = this.otherUsername;
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
