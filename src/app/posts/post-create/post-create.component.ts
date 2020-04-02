import { Component, OnInit } from '@angular/core';

import {FormControl, NgForm, Validators} from '@angular/forms';

import { PostsService } from '../posts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../post.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import { NgxImageCompressService} from 'ngx-image-compress';
import { LoginComponent } from 'src/app/login/login.component';

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
    buyer: '',
    imageUrls: [],
    mainImage: ''
  };


  public postGadget: object = { // translate from string to number
    condition: 0,
  }

  private price: FormControl;

  // Tag Configuration
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag[] = [];

  //image
  imgAfterCompressed: string;
  isCompressed: boolean = false;
  imageUrls = [];
  imageFiles: File[] = [];

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
  constructor(public postsService: PostsService,
    public route: ActivatedRoute,
    private router: Router,
    public imageCompress: NgxImageCompressService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        console.log('进入post-edit模式!');
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        console.log('postid: ' + this.postId);
        this.postsService.getPost(this.postId).then(transformedPosts => {
          this.post = {...transformedPosts.find(p => p.id === this.postId)};
          // @ts-ignore
          this.postGadget.condition = this.formatCondition(this.post.condition);
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.post.tags.length; i++){
            this.tags.push({name: this.post.tags[i]});
          }

          console.log( this.tags);
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
        return 1;
        break;
      case 'Used':
        return 2;
        break;
      case 'OpenBox':
        return 3;
        break;
      case 'Like New':
        return 4;
        break;
      default:
        return 5;
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

  onImagePicked(event){
    if((event.target as HTMLInputElement).files && (event.target as HTMLInputElement).files[0]){
      console.log("Create-post: %s has been chosen", (event.target as HTMLInputElement).files[0].name);
      var imageCount = (event.target as HTMLInputElement).files.length;
      for( let i = 0; i < imageCount; i ++){
        console.log(imageCount + "files have been chosen");
        var imageFile = (event.target as HTMLInputElement).files[i];
        const imageName = imageFile.name;
        const reader = new FileReader();
        reader.onload = () => {
          var imagePreview = reader.result as string;
          if(imageFile.size/(1024*1024) > 1)
          {
            this.isCompressed = true;
            this.imageCompress.compressFile(imagePreview, -1, 40, 40)
            .then(
              result =>{
                this.imgAfterCompressed = result;
                imagePreview = result;
                const imageBlob = this.dataURItoBlob(this.imgAfterCompressed.split(',')[1]);
                imageFile = new File([imageBlob], imageName, {type: 'image/jpeg'});
              }
            )
          }
           this.imageUrls.push(imagePreview);
        };
        this.imageFiles.push(imageFile);
        reader.readAsDataURL(imageFile);
      }
    }
    console.log("onImagePicked: " + this.imageUrls.length);
  }

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
        console.log("form is invalid");
        return;
      }
    if (this.mode === 'create') {
      // tslint:disable-next-line:max-line-length
      console.log("addPosts: " + this.imageFiles.length);
        this.postsService.addPost(form.value.title, form.value.content, form.value.price, localStorage.getItem('username'),
          form.value.category, this.formatLabel(form.value.condition), postTags, 'available', 0, '', this.imageFiles);
      } else {
        this.postsService.updatePost(this.postId, form.value.title,
          form.value.content, form.value.price, localStorage.getItem('username'),
          form.value.category, this.formatLabel(form.value.condition), postTags, 'available', this.post.viewCount, this.post.buyer, this.post.imageUrls, this.post.mainImage);
      }
    form.resetForm();
    this.router.navigate(['/']);
    }

    dataURItoBlob(dataURI){
      const byteString = window.atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });
      return blob;
    }
  }
