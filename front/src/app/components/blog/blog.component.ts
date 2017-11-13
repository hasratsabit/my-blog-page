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


// ==========================================================
//                      VARIABLES
// ==========================================================
  form; // This variable holds the form data.
  postBlogClass; // The success and error class.
  postBlogMessage; // The success and error message.
  name; // The variable is fetched from the getProfile method in authService to be added as author.
  username; // The variable is fetched from the getProfile method in authService which will be used to compare it with username in the blog to authorize the user for accesss.
  processing = false; // Conditional variable that determines to unable or disable the submit button.
  newBlogPost; // All Fetched blogs are assigned to this variable which will be used in the template.
  newBlogLink; // This stores the posted blog link if user wants to click on it.
  newPost = false // This hides the New Post button.


// ==========================================================
//                      CONSTRUCTOR
// ==========================================================
  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
      this.creatPostBlogForm();
    }

// ==========================================================
//                      CREATE FORM
// ==========================================================
  creatPostBlogForm() {
    // Assign the form validation to form variable.
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required, // Title is required.
        Validators.maxLength(100), // The max length for title is 100.
        Validators.minLength(5), // The min length for title is 5.
        this.validTitle // Use the validTitle method bellow to check for valid title.
      ])],

      body: ['', Validators.compose([
        Validators.required, // Body is required.
        Validators.maxLength(1500), // The max length for body is 1500.
        Validators.minLength(5) // The min length for body is 5.
      ])]
    })
  }


// ==========================================================
//                 VALID TITLE METHOD
// ==========================================================

    validTitle(controls){
      // Valid Title expression
      const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
      // Check if it is a valid title.
      if(regExp.test(controls.value)){
        return null; // Return null if it is a valid title.
      }else{
        // Return the error use the validTitle name to ouput message.
        return { 'validTitle': true }
      }
    }

// ==========================================================
//                      FORM DISABLE AND ENABLE
// ==========================================================
  disableForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  enableForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }


  loadBlogForm(){
    this.newPost = true;
  }

  cancelPostForm() {
    this.newPost = false;
  }

// ==========================================================
//                   POSTING NEW BLOG
// ==========================================================
  onNewBlogPost() {
    this.processing = true;// Set the proccessing to true when submitting the form.
    this.disableForm(); // Disable the form when proccessing the form.

    // Store the input values from post form in blog object.
    const blog = {
      title: this.form.get('title').value, // The title input value.
      body: this.form.get('body').value, // The body input value.
      createdBy: this.name, // The author name. This comes from getProfile method which is called in OnInit.
      username: this.username // The username. This comes from getProfile method which is called in OnInit.
    }

    // Send the blog using the postNewBlog in the blogService.
    this.blogService.postNewBlog(blog).subscribe(blog => {
      // Check if the blog is not successfully processed.
      if(!blog.success){
        this.processing = false; // Set the proccessing to false.
        this.postBlogClass = 'alert error-alert'; // Give the error class to div.
        this.postBlogMessage = blog.message; // Respond with error message from API.
        this.enableForm(); // Enable form for edit.
      }else{
        this.processing = true; // If no error, set to true.
        this.postBlogClass = 'alert success-alert'; // Give the success alert class.
        this.postBlogMessage = blog.message; // Respond with success message.
        this.newBlogLink = blog.blog; // This returns the posted blog link if user wants to click on it.
        this.disableForm(); // Disable the form.
        this.form.reset(); // Reset the form.
        this.getAllBlogs(); // Call the getAllBlogs method to update the blog feed.
        setTimeout(() => {
          this.postBlogClass = null; // Remove the class.
          this.postBlogMessage = null; // Remove the message.
        }, 5000)
      }
    })

  }



  // ==========================================================
  // 		                     GET ALL THE BLOGS
  // ==========================================================

    getAllBlogs() {
      this.blogService.getAllBlogs().subscribe(data => {
        this.newBlogPost = data.blog;
      })
    }



// ==========================================================
// 		                    LIFE CYCLE
// ==========================================================
  ngOnInit() {
    // Use the getProfile method in authService to load the logged in user information.
    this.authService.getProfile().subscribe(profile => {
      this.name = profile.user.name; // Assign the user name to name variable.
      this.username = profile.user.username; // Assign the user username to username variable.
    })

    // Call the getAllBlogs metod to update the blog feed.
    this.getAllBlogs();
  }

}
