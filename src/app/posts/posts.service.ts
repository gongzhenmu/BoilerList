import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Tag } from '@angular/compiler/src/i18n/serializers/xml_helper';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PostsService {

  private posts: Post[] = [];
  private myPost: Post;
  private postsUpdated = new Subject<Post[]>();

  private posturl = environment.apiUrl + '/posts';
  //favorite lists
  private addFavoriteUrl = environment.apiUrl + '/lists/addfavorite';
  private deleteFavoriteUrl = environment.apiUrl + '/lists/deletefavorite';
  private checkfavoriteUrl = environment.apiUrl + '/lists/checkFavorite';
  constructor(private http: HttpClient) { }
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
            buyer: post.buyer,
            imageUrls: post.imageUrls,
            mainImage: post.mainImage

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
            buyer: post.buyer,
            imageUrls: post.imageUrls,
            mainImage: post.mainImage,
            rated: post.rated
          };
        });
      })).toPromise();
  }

  addPost(title: string, content: string, price: string, owner: string, category: string, condition: string, tags: string[], status: string, viewCount: number, buyer: string, imageFiles: File[]) {
    // tslint:disable-next-line:max-line-length
    const post: Post = { id: null, title: title, content: content, price: price, owner: owner, category: category, condition: condition, tags: tags, status: status, viewCount: viewCount, buyer: buyer, imageUrls: null, mainImage: null, rated: false };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('price', price);
    postData.append('owner', owner);
    postData.append('category', category);
    postData.append('condition', condition);
    postData.append('status', status);
    postData.append('viewCount', viewCount.toString());
    postData.append('rated', 'false');

    for (let i = 0; i < tags.length; i++) {
      postData.append('tags', tags[i]);
    }
    //postData.append()
    for (let i = 0; i < imageFiles.length; i++) {
      postData.append('images', imageFiles[i], title + '-' + owner + '-' + imageFiles[i].name);
    }

    this.http
      .post<{ message: string, postId: string, imageUrls: string[], mainImage: string }>(this.posturl, postData)
      .subscribe(resData => {
        const id = resData.postId;
        post.id = id;
        post.imageUrls = resData.imageUrls;
        post.mainImage = resData.mainImage;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        //console.log("post id: %s", post.id);

        // postData.append('test', "testing string");
        // postData.append('postid', post.id);
        // this.http
        // .post<{imageUrls: string[], mainImage: string}>(this.posturl + '/upload-images', postData)
        // .subscribe(resData => {
        //     post.imageUrls = resData.imageUrls;
        //     post.mainImage = resData.mainImage;

        //     //window.location.reload();
        // });
      });

  }


  // tslint:disable-next-line:max-line-length
  updatePost(id: string, title: string, content: string, price: string, owner: string, category: string, condition: string, tags: string[], status: string, viewCount: number, buyer: string, imageUrls: string[], mainImage: string) {
    // tslint:disable-next-line:max-line-length
    const post: Post = { id: id, title: title, content: content, price: price, owner: owner, category: category, condition: condition, tags: tags, status: status, viewCount: viewCount, buyer: buyer, imageUrls: imageUrls, mainImage: mainImage, rated: false };
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

  updateViewCount(post: Post) {
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
  updateBuyer(post: Post, username: string) {
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

  setRated(post: Post) {
    const tempPost = post;
    tempPost.rated = true;
    this.http.put(this.posturl + '/' + tempPost.id, post).subscribe(resData => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });

  }

  updateMainImage(postid: string, imageUrl: string) {
    const updatedPosts = [...this.posts];
    const oldPostIndex = updatedPosts.findIndex(p => p.id === postid);
    var post = updatedPosts.find(p => p.id == postid);
    post.mainImage = imageUrl;
    console.log(imageUrl);
    this.http.put(this.posturl + '/updateMainImage', post).subscribe(resData => {
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  filterPosts(category: string | string | any, status: any, condition: any, minValue: number, maxValue: number) {
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
            buyer: post.buyer,
            imageUrls: post.imageUrls,
            mainImage: post.mainImage
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        const updatedPosts = this.posts.filter(post => {
          let matched = true;
          if (category !== '' && matched) {
            matched = (post.category === category);
          }
          if (status !== '' && matched) {
            matched = (post.status === status);
          }
          if (condition !== '' && matched) {
            matched = (post.condition === condition);
          }
          if (matched) {
            if (maxValue === 2000) {
              matched = (parseInt(post.price, 10) >= minValue);
            } else {
              matched = (parseInt(post.price, 10) >= minValue && parseInt(post.price, 10) <= maxValue);
            }
          }
          return matched;
        });
        console.log(updatedPosts);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
  addToFavorite(username:string, postId: string) {
    return this.http.post<any>(this.addFavoriteUrl, { username, postId });
  }
  checkFavorite(username:string, postId: string) {
    return this.http.post<any>(this.checkfavoriteUrl, { username, postId });
  }
  deleteFromFavorite(username:string, postId: string) {
    return this.http.post<any>(this.deleteFavoriteUrl, { username, postId });
  }

}
