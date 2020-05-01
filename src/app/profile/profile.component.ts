import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';
import { Review } from './review.model';
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
  favorite: Post[] = [];
  reviews: Review[] = [];
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
  private favoriteSub: Subscription;
  private reviewSub: Subscription;


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

  inFavorite = false;


  pendingList = false;
  notAvailable = false;
  purchaseUser = false;
  rateTheSeller = false;
  canRateSeller = false;
  SellerComment = false;
  noReviews = false;
  favoriteList = false;
  favoriteShow = true;
  ownPost = false;
  rating: number;
  displayRaing: number;
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
        //profileInfo
        this.profileService.getMyProfile(this.otherUsername);
        this.profileSub = this.profileService.getMyProfileUpdateListener()
          .subscribe((profile: Profile) => {
            this.profile = profile;
            this.displayRaing = this.profile.ratings/this.profile.ratingCount;
          });
        this.profile.username = this.otherUsername;
    //total
    this.profileService.getMyPosts(this.profile.username);
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

    //favorite
    this.profileService.getFavoriteList(localStorage.getItem('username'));
    this.favoriteSub = this.profileService.getFavoriteListUpdateListener()
      .subscribe((favorite: Post[]) =>{
        this.favorite = favorite;
      })
    // //sellingList
    //     this.profileService.getMyPosts(localStorage.getItem('username'));
    // this.postsSub = this.profileService.getMyPostsUpdateListener()
    //   .subscribe((posts: Post[]) => {
    //     this.posts = posts;
    //   });

    //review
    this.profileService.getRatingComment(this.otherUsername);
    this.reviewSub = this.profileService.getRatingCommentUpdateListener()
      .subscribe((reviews: Review[]) =>{
        this.reviews = reviews;
      })
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
      if (post.owner === this.currentUser) {
        this.ownPost = true;
      } else {
        this.ownPost = false;
      }
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

    if(!this.currentUserPage){
      this.postsService.checkFavorite(this.otherUsername, post.id)
      .subscribe(() => {
        this.inFavorite = true;
      }, err => {
        if (err.status === 302) {
          this.inFavorite = false;
        } else if (err.status === 500) {
          alert('Something went wrong');
        }
      });
    }

  }
  showMyLists() {
    this.MyPosts = true;
    this.showposts = this.posts;
    this.showList = false;
    this.favoriteList = false;
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
    this.favoriteList = false;
  }
  showPendingList() {
    this.MyPosts = true;
    this.showposts = this.pending;
    this.pendingList = true;
    this.showList = false;
    this.favoriteList = false;
  }
  showPurchaseList() {
    this.MyPosts = true;
    this.showposts = this.purchased;
    this.showList = false;
    this.favoriteList = false;
  }
  showFavoriteList(){
    this.MyPosts = true;
    this.showposts = this.favorite;
    this.showList = false;
    this.favoriteList = true;
  }
  rateSeller() {
    this.rateTheSeller = true;
  }
  updateRating(content:string) {
    console.log("here now");
    console.log(this.rating);
    this.profileService.updateRating(this.CurrentPost.owner, this.rating, content).subscribe(() => {
      alert("Thank you");
      this.postsService.setRated(this.CurrentPost);
      this.goBack();
    });
  }
  showSellerLists(){
    this.MyPosts = true;
    this.showposts = this.posts;
    this.showList = false;
    this.SellerComment = false;
    this.favoriteList = false;
  }
  showRatingComment(){
    this.SellerComment = true;
    this.showList = false;
    this.MyPosts = false;
    if(this.reviews.length == 0)
      this.noReviews = true;
    this.favoriteList = false;
  }
  addToFavoritePost(post: Post) {
    this.postsService.addToFavorite(localStorage.getItem('username'), post.id)
      .subscribe(() => {
        alert("Added to favorite list");
        this.inFavorite = true;
      }, err => {
        if (err.status === 500) {
          alert('Server Error!');
        } else if (err.status === 401) {
          alert('Something went wrong');
        }
      });
  }
  deleteFromFavorite(post: Post) {
    this.postsService.deleteFromFavorite(localStorage.getItem('username'), post.id)
      .subscribe(() => {
        alert("Successfully removed from your favorite list");
      }, err => {
        if (err.status === 500) {
          alert('Server Error!');
        } else if (err.status === 401) {
          alert('Something went wrong');
        }
      });
    window.location.reload();
  }
  purchaseItem(post: Post) {
    this.postsService.updateBuyer(post, this.currentUser);
    this.showList = true;
    alert('Success! \nYou can now go to your pending list to change this transaction status!');
  }

}
