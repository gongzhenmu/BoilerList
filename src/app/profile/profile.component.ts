import { Component, OnInit, OnDestroy,  ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NgxImageCompressService} from 'ngx-image-compress';
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
    password: '',
    avatarUrl: '',
  }

  private postsSub: Subscription;
  private profileSub: Subscription;
  constructor(private imageCompress: NgxImageCompressService, private route: ActivatedRoute, public profileService: ProfileService) { };
  public otherUsername;
  public currentUser = localStorage.getItem('username');
  public currentUserPage: Boolean = false;

  imagePreview: string;
  imageFile: File;
  imgAfterCompressed: string;
  compressedFile: File;
  isCompressed: boolean = false;

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

  onImagePicked(){
    this.imageFile = (event.target as HTMLInputElement).files[0];
    const imageName = this.imageFile.name;
    console.log(this.imageFile);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      if(this.imageFile.size/(1024*1024) > 1)
      {
        this.isCompressed = true;
        this.imageCompress.compressFile(this.imagePreview, -1, 40, 40)
        .then(
          result =>{
            this.imgAfterCompressed = result;
            this.imagePreview = result;
            const imageBlob = this.dataURItoBlob(this.imgAfterCompressed.split(',')[1]);
            this.compressedFile = new File([imageBlob], imageName, {type: 'image/jpeg'});
          }
        )
      }
    };
    reader.readAsDataURL(this.imageFile);
  }


  dataURItoBlob(dataURI){
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }



  onImageSubmit(){
    if(this.isCompressed){
      this.profileService.addAvatar(this.compressedFile, this.profile.username);
    }
    else{
      this.profileService.addAvatar(this.imageFile, this.profile.username);
    }

  }
}
