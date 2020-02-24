import { Injectable, ɵangular_packages_core_core_bm } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post } from '../posts/post.model';
import { map } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class ProfileService{

  private posts: Post[];
  private postsUpdated  = new Subject<Post[]>();

  private posturl = 'http://localhost:3000/api/profile';

  constructor(private http: HttpClient){};


  getMyPosts() {
    const httpParams = new HttpParams().set('username', localStorage.getItem('username'));
    this.http.get<{message: string; posts: any}>(this.posturl, {params: httpParams})
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          price: post.price,
          owner: post.owner,
          id: post._id
        };
      });
    }))
    .subscribe(transformedPosts => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getMyPostsUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string) {
    this.http.delete(this.posturl + '/delete/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

}
