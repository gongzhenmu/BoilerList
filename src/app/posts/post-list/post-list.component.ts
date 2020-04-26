import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Options } from 'ng5-slider';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';

interface Category {
  value: string;
  viewValue: string;
}

interface PriceRangeSlider {
  minValue: number;
  maxValue: number;
  options: Options;
}

interface Filter {
  category: string;
  minValue: number;
  maxValue: number;
  condition: string;
  status: string;
}

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

  // Category Configuration
  categories: Category[] = [
    {value: 'Book Exchange', viewValue: 'Book Exchange'},
    {value: 'Rideshare', viewValue: 'Rideshare'},
    {value: 'Housing, Rooms, Apartments, Sublets', viewValue: 'Housing, Rooms, Apartments, Sublets'},
    {value: 'Clothing', viewValue: 'Clothing'},
    {value: 'Shoes', viewValue: 'Shoes'},
    {value: 'Electronics', viewValue: 'Electronics'},
    {value: 'Video Games & Consoles', viewValue: 'Video Games & Consoles'},
    {value: 'Movies & Musics', viewValue: 'Movies & Musics'},
    {value: 'Cosmetics & Body Care', viewValue: 'Cosmetics & body Care'},
    {value: 'Bags & Accessories', viewValue: 'Bags & Accessories'},
    {value: 'Household Appliances', viewValue: 'Household Appliances'},
    {value: 'Furniture & Household Good', viewValue: 'Furniture & Household Good'},
    {value: 'Sports & Outdoor', viewValue: 'Sports & Outdoor'},
  ];

  // Filters
  public filter: Filter = {
    category: '',
    minValue: 0,
    maxValue: 5000,
    condition: '',
    status: ''
  };

  // priceRange
  priceRange: PriceRangeSlider = {
    minValue: 0,
    maxValue: 1000,
    options: {
      floor: 0,
      ceil: 5000,
      translate: (value: number): string => {
        return '$' + value;
      }
    },
  };
  toggleMessage: any;

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
    this.toggleMessage = 'Show Pending Posts!';
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  showDetails(post: Post) {
    this.showList = false;
    this.CurrentPost = post;
    this.postsService.updateViewCount(post);
    if (post.status != 'available') {
      this.itemSold = true;
    } else {
      this.itemSold = false;
    }
    if (post.owner == this.currentUser) {
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

  onToggled(e) {
    if (e.checked) {
      this.toggleMessage = 'Show Available Posts!';
    } else {
      this.toggleMessage = 'Show Pending Posts!';
    }
  }
  onChangeFilters(form: NgForm) {

    // Get category, status, condition
    console.log('FORM VALUE!!!');
    console.log(form.value);

    // Get price range
    console.log('Price Range!!!');
    console.log('$' + this.priceRange.minValue + '-$' + this.priceRange.maxValue);

    // combine all filters to fetch matching posts
    this.postsService.filterPosts(form.value.category, form.value.status ? 'pending' : 'available',
      form.value.condition, this.priceRange.minValue, this.priceRange.maxValue);
  }

}


