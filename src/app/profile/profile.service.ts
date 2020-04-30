import { Injectable, ɵangular_packages_core_core_bm } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post } from '../posts/post.model';
import { Review } from './review.model';
import { Profile } from '../profile/profile.model';
import { map } from 'rxjs/operators';
import { mimeType } from './mime-type.validator';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  private posts: Post[];
  private profile: Profile;
  private review: Review[];
  private postsUpdated = new Subject<Post[]>();
  private profileUpdated = new Subject<Profile>();
  //lists
  private puchasePost: Post[];
  private soldPost: Post[];
  private pendingPost: Post[];
  private searchPost: Post[];
  private favoritePost: Post[];
  private soldUpdated = new Subject<Post[]>();
  private pendingUpdated = new Subject<Post[]>();
  private purchaseUpdated = new Subject<Post[]>();
  private searchUpdated = new Subject<Post[]>();
  private favoriteUpdated = new Subject<Post[]>();
  private ratingCommentUpdated = new Subject<Review[]>();
  //backend
  private profileUrl = environment.apiUrl + '/profile';
  private verifyPass = environment.apiUrl + '/profile/verify';
  private changePass = environment.apiUrl + '/profile/changePassword';
  private forgetPass = environment.apiUrl + '/forgetPassword';
  private feedbackUrl = environment.apiUrl + '/profile/feedback';
  //list url
  private soldUrl = environment.apiUrl + '/lists/sold';
  private purchaseUrl = environment.apiUrl + '/lists/purchased';
  private pengdingUrl = environment.apiUrl + '/lists/pending';
  private rateUrl = environment.apiUrl + '/profile/rate';
  private contactUrl = environment.apiUrl + '/profile/contactUpdate';
  //search
  private searchUrl = environment.apiUrl + '/search';
  //favorite
  private favoriteUrl = environment.apiUrl + '/lists/favoriteList';
  //ratingcomment
  private ratingcommentUrl = environment.apiUrl + '/profile/getReviews';

  constructor(private http: HttpClient) { }

  getMyPosts(username: string) {
    const httpParams = new HttpParams().set('username', username);
    this.http.get<{ message: string; posts: any }>(this.profileUrl, { params: httpParams })
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            price: post.price,
            owner: post.owner,
            id: post._id,
            category: post.category,
            condition: post.condition,
            tags: post.tags,
            status: post.status,
            viewCount: post.viewCount,
            buyer: post.buyer,
            imageUrls: post.imageUrls,
            mainImage: post.mainImage,
            rated: post.rated,
            createdTime: post.createdTime
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getMySoldPosts() {
    const httpParams = new HttpParams().set('username', localStorage.getItem('username'));
    this.http.get<{ message: string; posts: any }>(this.soldUrl, { params: httpParams })
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            price: post.price,
            owner: post.owner,
            id: post._id,
            category: post.category,
            condition: post.condition,
            tags: post.tags,
            status: post.status,
            viewCount: post.viewCount,
            buyer: post.buyer,
            imageUrls: post.imageUrls,
            mainImage: post.mainImage,
            rated: post.rated,
            createdTime: post.createdTime
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.soldPost = transformedPosts;
        this.soldUpdated.next([...this.soldPost]);
      });
  }

  getMyPurchasePosts() {
    const httpParams = new HttpParams().set('username', localStorage.getItem('username'));
    this.http.get<{ message: string; posts: any }>(this.purchaseUrl, { params: httpParams })
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            price: post.price,
            owner: post.owner,
            id: post._id,
            category: post.category,
            condition: post.condition,
            tags: post.tags,
            status: post.status,
            viewCount: post.viewCount,
            buyer: post.buyer,
            imageUrls: post.imageUrls,
            mainImage: post.mainImage,
            rated: post.rated,
            createdTime: post.createdTime
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.puchasePost = transformedPosts;
        this.purchaseUpdated.next([...this.puchasePost]);
      });
  }

  getMyPendingPosts() {
    const httpParams = new HttpParams().set('username', localStorage.getItem('username'));
    this.http.get<{ message: string; posts: any }>(this.pengdingUrl, { params: httpParams })
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            price: post.price,
            owner: post.owner,
            id: post._id,
            category: post.category,
            condition: post.condition,
            tags: post.tags,
            status: post.status,
            viewCount: post.viewCount,
            buyer: post.buyer,
            imageUrls: post.imageUrls,
            mainImage: post.mainImage,
            rated: post.rated,
            createdTime: post.createdTime
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.pendingPost = transformedPosts;
        this.pendingUpdated.next([...this.pendingPost]);
      });
  }

  // ----------------search ------------
  getSearchPosts(title: string) {
    const httpParams = new HttpParams().set('title', title);
    this.http.get<{ message: string; posts: any }>(this.searchUrl, { params: httpParams })
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            price: post.price,
            owner: post.owner,
            id: post._id,
            category: post.category,
            condition: post.condition,
            tags: post.tags,
            status: post.status,
            viewCount: post.viewCount,
            buyer: post.buyer,
            imageUrls: post.imageUrls,
            mainImage: post.mainImage,
            rated: post.rated,
            createdTime: post.createdTime
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.searchPost = transformedPosts;
        this.searchUpdated.next([...this.searchPost]);
      });
  }

  //get favorite list posts
  getFavoriteList(username:string) {
    const httpParams = new HttpParams().set('username', username);
    this.http.get<{ message: string; posts: any }>(this.favoriteUrl, { params: httpParams })
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            price: post.price,
            owner: post.owner,
            id: post._id,
            category: post.category,
            condition: post.condition,
            tags: post.tags,
            status: post.status,
            viewCount: post.viewCount,
            buyer: post.buyer,
            imageUrls: post.imageUrls,
            mainImage: post.mainImage,
            rated: post.rated,
            createdTime: post.createdTime
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.favoritePost = transformedPosts;
        this.favoriteUpdated.next([...this.favoritePost]);
      });
  }

  getMyProfile(username) {
    const httpParams = new HttpParams().set('username', username);
    this.http.get<{
      user: any;
      message: string; posts: any
    }>(this.profileUrl, { params: httpParams })
      .pipe(map((postData) => {
        return postData.user;
      }))
      .subscribe(userProfile => {
        this.profile = userProfile;
        this.profileUpdated.next(this.profile);
      });
  }

  getMyPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getMyProfileUpdateListener() {
    return this.profileUpdated.asObservable();
  }

  getPurchasePostUpdateListener() {
    return this.purchaseUpdated.asObservable();
  }

  getSoldPostUpdateListener() {
    return this.soldUpdated.asObservable();
  }

  getPendingPostUpdateListener() {
    return this.pendingUpdated.asObservable();
  }
  getSearchPostUpdateListener() {
    return this.searchUpdated.asObservable();
  }
  getFavoriteListUpdateListener() {
    return this.favoriteUpdated.asObservable();
  }
  getRatingCommentUpdateListener(){
    return this.ratingCommentUpdated.asObservable();
  }

  deletePost(postId: string) {
    this.http.delete(this.profileUrl + '/delete/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // update post Status
  updateStatus(post: Post, status: string) {
    // tslint:disable-next-line:max-line-length
    const tempPost = post;
    tempPost.status = status;
    this.http.put(this.profileUrl + '/update/' + tempPost.id, tempPost).subscribe(resData => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  addAvatar(image: File, username: string) {
    const avatarData = new FormData();
    avatarData.append('image', image, username);
    avatarData.append('username', username);
    this.http.post<{ message: string; imagePath: string }>(
      environment.apiUrl + '/profile/avatar-upload',
      avatarData
    )
      .subscribe(responseData => {
        const imagePath = responseData.imagePath;
        (res) => console.log(res);
        console.log('image uploaded!');
      });
  }

  verifyPassword(username: string, password: string) {
    return this.http.post<any>(this.verifyPass, { username, password });
  }

  sendFeedback(feedback: string) {
    return this.http.post<any>(this.feedbackUrl, { feedback });
  }

  updatePassword(username: string, password: string) {
    return this.http.post<any>(this.changePass, { username, password });
  }

  updateRating(username: string, rate: number, content:string) {
    return this.http.post<any>(this.rateUrl, { username, rate , content});
  }

  updateContact(username: string, contact: string) {
    return this.http.post<any>(this.contactUrl, { username, contact });
  }

  forgetPassword(email: string) {
    return this.http.post<any>(this.forgetPass, { email });
  }

  getRatingComment(username: string) {
    const httpParams = new HttpParams().set('username', username);
    this.http.get<{ review: any }>(this.ratingcommentUrl, { params: httpParams })
      .pipe(map((reviewData) => {
        console.log(reviewData);
        console.log(username);
        return reviewData.review.map(review => {
          return {
            rate: review.rate,
            content: review.content
          };
        });
      }))
      .subscribe(transformedReview => {
        this.review = transformedReview;
        this.ratingCommentUpdated.next([...this.review]);
      });
  }

  sortPosts(fieldToSort: string){

    if(fieldToSort.match("priceA")){
      this.searchPost.sort((a,b) => parseFloat(a.price) - parseFloat(b.price));
    }
    else if(fieldToSort.match("priceD")){
      this.searchPost.sort((b,a) => parseFloat(a.price) - parseFloat(b.price));
    }
    else if(fieldToSort.match("viewCountA")){
      this.searchPost.sort((b,a) => a.viewCount - b.viewCount);
    }
    else if(fieldToSort.match("viewCountD")){
      this.searchPost.sort((a,b) => a.viewCount - b.viewCount);
    }
    else if(fieldToSort.match("titleA")){
      this.searchPost.sort((a,b) => a.title.localeCompare(b.title));
    }
    else if(fieldToSort.match("titleD")){
      this.searchPost.sort((b,a) => a.title.localeCompare(b.title));
    }
    else if(fieldToSort.match("timeA")){
      this.searchPost.sort((a,b) => a.createdTime - b.createdTime);
    }
    else if(fieldToSort.match("timeD")){
      this.searchPost.sort((b,a) => a.createdTime - b.createdTime);
    }
    this.searchUpdated.next([...this.searchPost]);
  }
}
