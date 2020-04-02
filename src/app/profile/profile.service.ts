import { Injectable, ɵangular_packages_core_core_bm } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post } from '../posts/post.model';
import { Profile } from '../profile/profile.model';
import { map } from 'rxjs/operators';
import {mimeType } from './mime-type.validator';

@Injectable({providedIn: 'root'})
export class ProfileService {

  private posts: Post[];
  private profile: Profile;
  private postsUpdated  = new Subject<Post[]>();
  private profileUpdated  = new Subject<Profile>();
  //lists
  private puchasePost: Post[];
  private soldPost: Post[];
  private pendingPost: Post[];
  private soldUpdated  = new Subject<Post[]>();
  private pendingUpdated  = new Subject<Post[]>();
  private purchaseUpdated  = new Subject<Post[]>();



  //backend
  private profileUrl = 'http://localhost:3000/api/profile';
  private verifyPass = 'http://localhost:3000/api/profile/verify';
  private changePass = 'http://localhost:3000/api/profile/changePassword';
 //list url
  private soldUrl = 'http://localhost:3000/api/lists/sold';
  private purchaseUrl = 'http://localhost:3000/api/lists/purchased';
  private pengdingUrl = 'http://localhost:3000/api/lists/pending';
  private rateUrl = 'http://localhost:3000/api/profile/rating';


  constructor(private http: HttpClient) {}


  getMyPosts() {
    const httpParams = new HttpParams().set('username', localStorage.getItem('username'));
    this.http.get<{message: string; posts: any}>(this.profileUrl, {params: httpParams})
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
          buyer: post.buyer
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
    this.http.get<{message: string; posts: any}>(this.soldUrl, {params: httpParams})
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
          buyer: post.buyer
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
    this.http.get<{message: string; posts: any}>(this.purchaseUrl, {params: httpParams})
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
          buyer: post.buyer
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
    this.http.get<{message: string; posts: any}>(this.pengdingUrl, {params: httpParams})
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
          buyer: post.buyer
        };
      });
    }))
    .subscribe(transformedPosts => {
      this.pendingPost = transformedPosts;
      this.pendingUpdated.next([...this.pendingPost]);
    });
  }


  getMyProfile(username) {
    const httpParams = new HttpParams().set('username', username);
    this.http.get<{
      user: any;
      message: string; posts: any}>(this.profileUrl, {params: httpParams})
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

  getPurchasePostUpdateListener(){
    return this.purchaseUpdated.asObservable();
  }

  getSoldPostUpdateListener(){
    return this.soldUpdated.asObservable();
  }

  getPendingPostUpdateListener(){
    return this.pendingUpdated.asObservable();
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
      alert('Post status is updated!');
    });
  }

  addAvatar(image: File, username: string) {
    const avatarData = new FormData();
    avatarData.append('image', image, username);
    avatarData.append('username', username);
    this.http.post< {message: string; imagePath: string}>(
      'http://localhost:3000/api/profile/avatar-upload',
      avatarData
    )
    .subscribe(responseData => {
      const imagePath = responseData.imagePath;
      (res) => console.log(res);
      console.log('image uploaded!');
    });
  }


  verifyPassword(username: string, password: string) {
    return this.http.post<any>(this.verifyPass, {username, password});
  }


  updatePassword(username: string, password: string) {
    return this.http.post<any>(this.changePass, {username, password});

  }


  updateRating(username: string, rate: number) {
    return this.http.post<any>(this.rateUrl, {username, rate});
  }





}
