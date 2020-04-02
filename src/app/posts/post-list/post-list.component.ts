import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;
  constructor(public postsService: PostsService) {}
  showList = true;
  CurrentPost: Post;
  itemSold = false;
  public currentUser = localStorage.getItem('username');
  ownPost = false;

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  showDetails(post: Post){
    this.showList = false;
    this.CurrentPost = post;
    this.postsService.updateViewCount(post);
    if(post.status != 'available')
      this.itemSold = true;
    else
      this.itemSold = false;
    if(post.owner == this.currentUser)
      this.ownPost = true;
    else
      this.ownPost = false;
  }
  purchaseItem(post: Post){
    this.postsService.updateBuyer(post, this.currentUser);
    this.showList = true;
  }
}
