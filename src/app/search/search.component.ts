import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Post } from '../posts/post.model';
import { Subscription } from 'rxjs';
import { ProfileService } from '../profile/profile.service';
import { PostsService } from '../posts/posts.service';
import {NgForm} from '@angular/forms';
import {Options} from 'ng5-slider';

interface Category {
  value: string;
  viewValue: string;
}

interface Filter {
  category: string;
  minValue: number;
  maxValue: number;
  condition: string;
  status: string;
}

interface PriceRangeSlider {
  minValue: number;
  maxValue: number;
  options: Options;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  public searchResultBackUp: Post[] = [];
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

  // Select filterForm from html and name it as form
  // @ts-ignore
  @ViewChild('filterForm') form: NgForm;

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
        this.searchResultBackUp = this.searchResult;
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

  onToggled(e) {
    if (e.checked) {
      this.toggleMessage = 'Show Available Posts!';
    } else {
      this.toggleMessage = 'Show Pending Posts!';
    }
  }
  onChangeFilters(form: NgForm) {
    this.searchResult = this.searchResultBackUp;
    console.log(form.value);
    // combine all filters to fetch matching posts
    const filteredPosts = this.searchResult.filter(post => {
      let matched = true;
      if (form.value.category !== '' && matched) {
        matched = (post.category === form.value.category);
      }
      if (form.value.status !== '' && matched) {
        matched = (post.status === (form.value.status ? 'pending' : 'available'));
      }
      if (this.form.value.condition !== '' && matched) {
        matched = (post.condition === form.value.condition);
      }
      if (matched) {
        if (this.priceRange.maxValue === 2000) {
          matched = (parseInt(post.price, 10) >= this.priceRange.minValue);
        } else {
          matched = (parseInt(post.price, 10) >= this.priceRange.minValue && parseInt(post.price, 10) <= this.priceRange.maxValue);
        }
      }

      if (matched) {
        console.log('Bingo! A post that satisfies all conditions is found!');
        console.log(post);
      }

      return matched;
    });
    console.log('Posts that filtered');
    console.log(filteredPosts);
    this.searchResult = filteredPosts;
  }

  onResetFilters() {
    // Reset form
    this.form.reset();

    // get all posts
    this.postsService.getPosts();

  }

}
