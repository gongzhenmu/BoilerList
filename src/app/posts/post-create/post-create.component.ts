import { Component, OnInit } from '@angular/core';

import {FormControl, NgForm, Validators} from '@angular/forms';

import { PostsService } from '../posts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../post.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

interface Category {
  value: string;
  viewValue: string;
}
interface Tag {
  name: string;
}
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent implements OnInit {
  // Post configuration
  enteredTitle = '' ;
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  public post: Post = {
    id: '',
    title: '',
    content: '',
    price: '',
    owner: '',
    category: '',
    condition: '',
    status: '',
    tags: [],
    viewCount: 0,
    buyer: ''
  }

  public postGadget: object = {
    condition: 2,
    tags: ['123', '321', '888'],
  }

  private price: FormControl;

  // Tag Configuration
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag[] = [];

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

  // Construct router and initialize at the beginning
  constructor(public postsService: PostsService, public route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        console.log('进入post-edit模式!');
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        console.log('postid: ' + this.postId);
        this.postsService.getPost(this.postId).then(transformedPosts => {
          this.post = {...transformedPosts.find(p => p.id === this.postId)};
          this.postGadget
          console.log('post长这样子');
          console.log(this.post);
          console.log(this.post.title);
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });

    this.price = new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]);
  }

  // thumb Label functions
  formatLabel(value: number) {
    switch (value) {
      case 0:
        return 'Broken';
        break;
      case 1:
        return 'Refurbished';
        break;
      case 2:
        return 'Used';
        break;
      case 3:
        return 'OpenBox';
        break;
      case 4:
        return 'Like New';
        break;
      default:
        return 'New';
        break;
    }
  }
  formatCondition(value: string) {
    switch (value) {
      case 'Broken':
        return 0;
        break;
      case 'Refurbished':
        return '';
        break;
      case 'Used':
        return '';
        break;
      case 'OpenBox':
        return '';
        break;
      case 4:
        return 'Like New';
        break;
      default:
        return 'New';
        break;
    }
  }

  // ChipInput functions
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Only push more tags if not exceeding 3
    if (this.tags.length !== 3 && (value || '').trim()) {
      this.tags.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  // Post function
  onSavePost(form: NgForm) {
    console.log('FORM VALUE!!!');
    console.log(form.value);
    const postTags: string[] = [];
    // tslint:disable-next-line:only-arrow-functions
    this.tags.forEach(function(tag){
      postTags.push(tag.name);
    });
    console.log('TAG LIST!!!');
    console.log(postTags);
    if (form.invalid) {
        return;
      }
    if (this.mode === 'create') {
      // tslint:disable-next-line:max-line-length
        this.postsService.addPost(form.value.title, form.value.content, form.value.price, localStorage.getItem('username'),
          form.value.category, this.formatLabel(form.value.condition), postTags, 'available', 0, '');
      } else {
        this.postsService.updatePost(this.postId, form.value.title,
          form.value.content, form.value.price, localStorage.getItem('username'),
          form.value.category, this.formatLabel(form.value.condition), postTags, 'available', this.post.viewCount, this.post.buyer);
      }
    form.resetForm();
    this.router.navigate(['/']);
    }
  }


