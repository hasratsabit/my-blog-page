import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { Http, Headers, RequestOptions } from "@angular/http";

@Injectable()
export class BlogService {

// ==========================================================
//                     CREATE HEADER 
// ==========================================================
  options;
  domain = this.authService.domain;


  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

// ==========================================================
//                     CREATE HEADER
// ==========================================================

  createAuthenticationHeaders() {
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    })
  }

// ==========================================================
//                     POST NEW BLOG
// ==========================================================
  postNewBlog(blog){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/blogs/newBlog', blog, this.options).map(res => res.json())
  }

// ==========================================================
//                     GET ALL BLOGS
// ==========================================================
  getAllBlogs() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/blogs/getAllBlogs', this.options).map(res => res.json());
  }

}
