import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {  HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import {Tag} from '@angular/compiler/src/i18n/serializers/xml_helper';

@Injectable({providedIn: 'root'})
export class PostsService {

  private posts: Post[] = [];
  private myPost: Post;
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

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ message: string; posts: any }>(this.posturl)
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
      })).toPromise();
  }

  addPost(title: string, content: string, price: string, owner: string, category: string, condition: string, tags: string[], status: string, viewCount: number, buyer: string) {
    // tslint:disable-next-line:max-line-length
    const post: Post = { id: null, title: title, content: content, price: price, owner: owner, category: category, condition: condition, tags: tags, status: status, viewCount: viewCount, buyer: buyer};
    console.log('Post created!');
    console.log(post);
    this.http
      .post<{ message: string, postId: string }>(this.posturl, post)
      .subscribe(resData => {
        const id = resData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  // tslint:disable-next-line:max-line-length
  updatePost(id: string, title: string, content: string, price: string, owner: string, category: string, condition: string, tags: string[], status: string, viewCount: number, buyer: string) {
    // tslint:disable-next-line:max-line-length
    const post: Post = { id: id, title: title, content: content, price: price, owner: owner, category: category, condition: condition, tags: tags, status: status, viewCount: viewCount, buyer: buyer};
    this.http.put(this.posturl + '/' + id, post).subscribe(resData => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
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

  updateViewCount(post: Post){
    const tempPost = post;
    tempPost.viewCount += 1;
    this.http.put(this.posturl + '/' + tempPost.id, post).subscribe(resData => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
  updateBuyer(post: Post, username: string){
    const tempPost = post;
    tempPost.buyer = username;
    tempPost.status = 'pending';
    this.http.put(this.posturl + '/' + tempPost.id, post).subscribe(resData => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });

  }
}
