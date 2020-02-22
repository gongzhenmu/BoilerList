import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';
import {ActivatedRoute} from '@angular/router';
import {Post} from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent implements OnInit {
  enteredTitle = '' ;
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  public post: Post = {
    id: '',
    title: '',
    content: '',
    price: '',
    owner: ''
  }

   constructor(public postsService: PostsService, public route: ActivatedRoute) {}
    ngOnInit(): void {
       this.route.paramMap.subscribe((paramMap) => {
         if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.post = this.postsService.getPost(this.postId);
         } else{
           this.mode = 'create';
           this.postId = null;
         }
       });
    }

  onSavePost(form: NgForm) {
      if (form.invalid) {
        return;
      }
      if (this.mode === 'create') {
        this.postsService.addPost(form.value.title, form.value.content, form.value.price, sessionStorage.getItem('username'));
      } else {
        this.postsService.updatePost(this.postId, form.value.title,
          form.value.content, form.value.price, sessionStorage.getItem('username'));
      }
      form.resetForm();
    }
  }


