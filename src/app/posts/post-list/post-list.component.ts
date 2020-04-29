import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Options } from 'ng5-slider';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

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

  // Select filterForm from html and name it as form
  // @ts-ignore
  @ViewChild('filterForm') form: NgForm;

  // Filters
  public filter: Filter = {
    category: '',
    minValue: 0,
    maxValue: 1000,
    condition: '',
    status: ''
  };

  // priceRange
  priceRange: PriceRangeSlider = {
    minValue: 0,
    maxValue: 1000,
    options: {
      floor: 0,
      ceil: 2000,
      translate: (value: number): string => {
        if (value === 2000) {
          return '$' + value + '+';
        } else {
            return '$' + value;
        }
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
  addToFavoritePost(post: Post){
    this.postsService.addToFavorite(localStorage.getItem('username'), post.id)
    .subscribe(() => {
      alert("Added to favorite list");
    }, err => {
      if (err.status === 500) {
        alert('Server Error!');
      } else if (err.status === 401) {
        alert('Something went wrong');
      }
    });
  }

  onResetFilters() {
    // Reset form
    this.form.reset();

    // get all posts
    this.postsService.getPosts();

  }
}


