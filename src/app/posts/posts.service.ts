import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {  HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  private posturl = 'http://localhost:3000/api/posts';
  constructor(private http: HttpClient) {}
  getPosts() {
    this.http.get<{ message: string; posts: any }>(this.posturl)
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

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, price: string, owner: string) {
    const post: Post = { id: null, title: title, content: content, price: price, owner: owner};
    this.http
      .post<{ message: string, postId: string }>(this.posturl, post)
      .subscribe(resData => {
        const id = resData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
  deletePost(postId: string) {
    this.http.delete(this.posturl + '/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
