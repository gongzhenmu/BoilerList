import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Router } from '@angular/router';
import { PostsService } from '../posts/posts.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {
  showposts: Post[] = [];
  posts: Post[] = [];
  sold: Post[] = [];
  purchased: Post[] = [];
  pending: Post[] = [];
  public profile: Profile = {
    username: '',
    email: '',
    password: '',
    avatarUrl: '',
    contact: '',
    ratings: 0,
    ratingCount: 0
  }
  private soldSub: Subscription;
  private purchasedSub: Subscription;
  private pendingSub: Subscription;
  private postsSub: Subscription;
  private profileSub: Subscription;


  constructor(private imageCompress: NgxImageCompressService,
    private router: Router,
    private route: ActivatedRoute, public profileService: ProfileService,
    public postsService: PostsService) { };
  public otherUsername;
  public currentUser = localStorage.getItem('username');
  public currentUserPage: Boolean = false;
  public choosedPicture: Boolean = false;

  imagePreview: string;
  imageFile: File;
  imgAfterCompressed: string;
  compressedFile: File;
  isCompressed: boolean = false;
  showList = false;
  MyPosts = false;
  CurrentPost: Post;


  pendingList = false;
  notAvailable = false;
  purchaseUser = false;
  rateTheSeller = false;
  canRateSeller = false;
  rating: number;
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        of(params.get('username'))
      )
    ).subscribe((d) => {
      this.otherUsername = d;
    });
    if (this.otherUsername == null) {
      this.otherUsername = this.currentUser;
      this.currentUserPage = true;
    }
    //total
    this.profileService.getMyPosts();
    this.postsSub = this.profileService.getMyPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
    //sold
    this.profileService.getMySoldPosts();
    this.soldSub = this.profileService.getSoldPostUpdateListener()
      .subscribe((sold: Post[]) => {
        this.sold = sold;
        //   for(var i = 0;i<this.sold.length;i++){
        //   console.log(this.sold[i].title);
        // }
      });

    //pending
    this.profileService.getMyPendingPosts();
    this.pendingSub = this.profileService.getPendingPostUpdateListener()
      .subscribe((pending: Post[]) => {
        this.pending = pending;
      });

    //purchased
    this.profileService.getMyPurchasePosts();
    this.purchasedSub = this.profileService.getPurchasePostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.purchased = posts;
      });
    //profileInfo
    this.profileService.getMyProfile(this.otherUsername);
    this.profileSub = this.profileService.getMyProfileUpdateListener()
      .subscribe((profile: Profile) => {
        this.profile = profile;
      });
    this.profile.username = this.otherUsername;
    
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.profileSub.unsubscribe();
    this.soldSub.unsubscribe();
    this.purchasedSub.unsubscribe();
    this.pendingSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.profileService.deletePost(postId);
    window.location.reload();
  }

  // onPending(post: Post) {
  //   this.profileService.updateStatus(post, 'pending');
  // }

  onSold(post: Post) {
    this.profileService.updateStatus(post, 'sold');
    window.location.reload();
  }

  onAvailable(post: Post) {
    this.postsService.updateBuyer(post, 'None');
    this.profileService.updateStatus(post, 'available');
    window.location.reload();
  }
  showDetails(post: Post) {
    this.showList = true;
    this.CurrentPost = post;
    if (post.status == 'pending' || post.status == 'sold')
      this.notAvailable = true;
    else
      this.notAvailable = false;

    if (post.status == 'pending') {
      this.pendingList = true;
      if (post.buyer == this.currentUser)
        this.purchaseUser = true;
      else
        this.purchaseUser = false;
    }
    else
      this.pendingList = false;

    if (post.status == 'sold' && this.CurrentPost.buyer == this.currentUser)
      this.canRateSeller = true;
    else
      this.canRateSeller = false;

  }
  showMyLists() {
    this.MyPosts = true;
    this.showposts = this.posts;
    this.showList = false;
  }
  goBack() {
    this.MyPosts = true;
    this.showList = false;
    this.rateTheSeller = false;
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
  showSoldList() {
    this.MyPosts = true;
    this.showList = false;
    this.showposts = this.sold;

  }
  showPendingList() {
    this.MyPosts = true;
    this.showposts = this.pending;
    this.pendingList = true;
    this.showList = false;
  }
  showPurchaseList() {
    this.MyPosts = true;
    this.showposts = this.purchased;
    this.showList = false;
  }
  rateSeller() {
    this.rateTheSeller = true;
  }
  updateRating() {
    console.log("here now");
    console.log(this.rating);
    this.profileService.updateRating(this.CurrentPost.owner, this.rating).subscribe(() => {
      alert("Thank you");
      this.postsService.setRated(this.CurrentPost);
      this.goBack();
    });

  }

}
