import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../posts/post.model';
import { Subscription } from 'rxjs';
import { ProfileService } from '../profile/profile.service';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  showposts: Post[] = [];
  searchResult: Post[] = [];
  private searchSub: Subscription;
  constructor(public profileservice: ProfileService, public postsService: PostsService) { }
  public search: string = '';
  private showList:boolean = true;
  CurrentPost: Post;
  itemSold = false;
  public currentUser = localStorage.getItem('username');
  ownPost = false;
  ngOnInit() {
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }

  searchTitle(search:string){
    if(search==''||search==null){
      alert("Please input a string to search.");
      return;
    }
    this.profileservice.getSearchPosts(search);
    this.searchSub = this.profileservice.getSearchPostUpdateListener()
      .subscribe((searchResult: Post[]) => {
        this.searchResult = searchResult;
      });
  }
  showDetails(post: Post) {
    this.showList = false;
    this.CurrentPost = post;
    this.postsService.updateViewCount(post);
    if (post.status !== 'available') {
      this.itemSold = true;
    } else {
      this.itemSold = false;
    }
    if (post.owner === this.currentUser) {
      this.ownPost = true;
    } else {
      this.ownPost = false;
    }
  }
  purchaseItem(post: Post) {
    this.postsService.updateBuyer(post, this.currentUser);
    this.showList = true;
    alert('Success! \nYou can now go to your pending list to change this transaction status!');
  }

}
