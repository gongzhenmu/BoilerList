import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Subscription } from 'rxjs';
import { Profile } from '../profile/profile.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Post } from '../posts/post.model';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
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
  public editPost = false;
  private profileSub: Subscription;
  constructor(private imageCompress: NgxImageCompressService,
    public profileService: ProfileService,
    private router: Router,
    public authService: AuthService) { };
  public currentUser = this.authService.getUsername();

  private postsSub: Subscription;
  public choosedPicture: Boolean = false;

  imagePreview: string;
  imageFile: File;
  imgAfterCompressed: string;
  compressedFile: File;
  isCompressed: boolean = false;
  ngOnInit() {
    this.profileService.getMyPosts();
    this.postsSub = this.profileService.getMyPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });

    this.profileService.getMyProfile(this.currentUser);
    this.profileSub = this.profileService.getMyProfileUpdateListener()
      .subscribe((profile: Profile) => {
        this.profile = profile;
      });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.profileSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.profileService.deletePost(postId);
  }

  onPending(post: Post) {
    this.profileService.updateStatus(post, 'pending');
  }

  onSold(post: Post) {
    this.profileService.updateStatus(post, 'sold');
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

  onImagePicked() {
    this.imageFile = (event.target as HTMLInputElement).files[0];
    const imageName = this.imageFile.name;
    console.log(this.imageFile);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      if (this.imageFile.size / (1024 * 1024) > 1) {
        this.isCompressed = true;
        this.imageCompress.compressFile(this.imagePreview, -1, 40, 40)
          .then(
            result => {
              this.imgAfterCompressed = result;
              this.imagePreview = result;
              const imageBlob = this.dataURItoBlob(this.imgAfterCompressed.split(',')[1]);
              this.compressedFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
            }
          )
      }
    };
    reader.readAsDataURL(this.imageFile);
    this.choosedPicture = true;
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  onImageSubmit() {
    if (this.isCompressed) {
      this.profileService.addAvatar(this.compressedFile, this.profile.username);
    }
    else {
      this.profileService.addAvatar(this.imageFile, this.profile.username);
    }
    window.location.reload();
  }
  editPosts(){
    this.editPost = true;
  }
  cancelEditPosts(){
    this.editPost = false;
  }
}
