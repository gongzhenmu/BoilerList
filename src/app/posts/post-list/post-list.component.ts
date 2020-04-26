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
    {value: 'Antiques', viewValue: 'Antiques'},
    {value: 'Art', viewValue: 'Art'},
    {value: 'Baby', viewValue: 'Baby'},
    {value: 'Books', viewValue: 'Books'},
    {value: 'Business & Industrial', viewValue: 'Business & Industrial'},
    {value: 'Cameras & Photo', viewValue: 'Cameras & Photo'},
    {value: 'Cell Phones & Accessories', viewValue: 'Cell Phones & Accessories'},
    {value: 'Clothing, Shoes & Accessories', viewValue: 'Clothing, Shoes & Accessories'},
    {value: 'Coins & Paper Money', viewValue: 'Coins & Paper Money'},
    {value: 'Collectibles', viewValue: 'Collectibles'},
    {value: 'Computers/Tablets & Networking', viewValue: 'Computers/Tablets & Networking'},
    {value: 'Consumer Electronics', viewValue: 'Consumer Electronics'},
    {value: 'Crafts', viewValue: 'Crafts'},
    {value: 'Dolls & Bears', viewValue: 'Dolls & Bears'},
    {value: 'DVDs & Movies', viewValue: 'DVDs & Movies'},
    {value: 'Entertainment Memorabilia', viewValue: 'Entertainment Memorabilia'},
    {value: 'Gift Cards & Coupons', viewValue: 'Gift Cards & Coupons'},
    {value: 'Health & Beauty', viewValue: 'Health & Beauty'},
    {value: 'Home & Garden', viewValue: 'Home & Garden'},
    {value: 'Jewelry & Watches', viewValue: 'Jewelry & Watches'},
    {value: 'Music', viewValue: 'Music'},
    {value: 'Musical Instruments & Gear', viewValue: 'Musical Instruments & Gear'},
    {value: 'Pet Supplies', viewValue: 'Pet Supplies'},
    {value: 'Pottery & Glass', viewValue: 'Pottery & Glass'},
    {value: 'Real Estate', viewValue: 'Real Estate'},
    {value: 'Specialty Services', viewValue: 'Specialty Services'},
    {value: 'Sporting Goods', viewValue: 'Sporting Goods '},
    {value: 'Sports Mem, Cards & Fan Shop', viewValue: 'Sports Mem, Cards & Fan Shop'},
    {value: 'Stamps', viewValue: 'Stamps'},
    {value: 'Tickets & Experiences', viewValue: 'Tickets & Experiences'},
    {value: 'Toys & Hobbies', viewValue: 'Toys & Hobbies'},
    {value: 'Travel', viewValue: 'Travel'},
    {value: 'Video Games & Consoles', viewValue: 'Video Games & Consoles'}
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


