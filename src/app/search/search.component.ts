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

  //Sort Configutation
  sort: Category[] = [
    { value: 'titleA', viewValue: 'Sort by Title(ascending)' },
    { value: 'titleD', viewValue: 'Sort by Title(descending)' },
    { value: 'viewCountA', viewValue: 'Most Views First' },
    { value: 'viewCountD', viewValue: 'Least Views First' },
    { value: 'priceA', viewValue: 'Lowest Price First' },
    { value: 'priceD', viewValue: 'Highest Price First' },
    { value: 'timeD', viewValue: 'Oldest Posts First' },
    { value: 'timeA', viewValue: 'Newest Posts First' },
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
    maxValue: 2000,
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
  hasSearched = false;
  inFavorite = false;
  ngOnInit() {
    this.toggleMessage = 'Show Available Posts Only!';
  }

  ngOnDestroy() {
    if(this.hasSearched)
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
        console.log('searchResultBackUp');
        console.log(this.searchResultBackUp);
        this.hasSearched = true;
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
    this.postsService.checkFavorite(localStorage.getItem('username'), post.id)
      .subscribe(() => {
        this.inFavorite = true;
      }, err => {
        if (err.status === 302) {
          this.inFavorite = false;
        } else if (err.status === 500) {
          alert('Something went wrong');
        }
      });
  }
  purchaseItem(post: Post) {
    this.postsService.updateBuyer(post, this.currentUser);
    this.showList = true;
    alert('Success! \nYou can now go to your pending list to change this transaction status!');
  }

  onToggled(e) {
    if (e.checked) {
      this.toggleMessage = 'Show Available Posts Only!';
    } else {
      this.toggleMessage = 'Show All Posts!';
    }
  }
  onChangeFilters(form: NgForm) {
    this.searchResult = this.searchResultBackUp;
    console.log('Search Results!!!');
    console.log(this.searchResult);

    // combine all filters to fetch matching posts
    const filteredPosts = this.searchResult.filter(post => {
      let matched = true;
      if (form.value.category !== '' && matched) {
        matched = (post.category === form.value.category);
      }
      if (form.value.status !== '' && matched) {
        console.log(form.value.status);
        if (form.value.status === true) {
          matched = (post.status === 'available');
        }
        console.log(matched);
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
    window.location.reload();
  }
  onSort(sort: string){
    this.profileservice.sortPosts(sort);
 }
 goback(){
   this.showList = true;
 }
 addToFavoritePost(post: Post) {
  this.postsService.addToFavorite(localStorage.getItem('username'), post.id)
    .subscribe(() => {
      alert("Added to favorite list");
      this.inFavorite = true;
    }, err => {
      if (err.status === 500) {
        alert('Server Error!');
      } else if (err.status === 401) {
        alert('Something went wrong');
      }
    });
}

deleteFromFavoritePost(post: Post) {
  this.postsService.deleteFromFavorite(localStorage.getItem('username'), post.id)
    .subscribe(() => {
      alert("Deleted from favorite list");
      this.inFavorite = false;
    }, err => {
      if (err.status === 500) {
        alert('Server Error!');
      } else if (err.status === 401) {
        alert('Something went wrong');
      }
    });
}

}
