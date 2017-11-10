import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BlogService } from "../../services/blog.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.sass']
})
export class BlogComponent implements OnInit {

  form; // This variable holds the form data.
  postBlogClass; // The success and error class.
  postBlogMessage; // The success and error message.
  name; // The variable is fetched from the getProfile method in authService to be added as author.
  processing = false; // Conditional variable that determines to unable or disable the submit button.

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
      this.creatPostBlogForm();
    }


  creatPostBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(5),
        this.validTitle
      ])],

      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(1500),
        Validators.minLength(5)
      ])]
    })
  }


  disableForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  enableForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }




  validTitle(controls){
    // Valid Title expression
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validTitle': true }
    }
  }

  onNewBlogPost() {
    this.processing = true;
    this.disableForm();

    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.name
    }

    this.blogService.postNewBlog(blog).subscribe(blog => {
      if(!blog.success){
        this.processing = false;
        this.postBlogClass = 'alert error-alert';
        this.postBlogMessage = blog.message;
        this.enableForm();
      }else{
        this.processing = true;
        this.postBlogClass = 'alert success-alert';
        this.postBlogMessage = blog.message;
        this.disableForm();
        setTimeout(() => {
          this.form.reset();
          this.router.navigate(['/']);
        }, 2000)
      }
    })

  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.name = profile.user.name;
    })
  }

}
