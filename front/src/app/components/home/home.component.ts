import { Component, OnInit } from '@angular/core';
import { BlogService } from "../../services/blog.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  newBlogPost;
  blogLiked = false;
  userLiked;
  username;
  currentBlogId;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.newBlogPost = data.blog
    })
  }

  likeBlog(id) {
  // Service to like a blog post
  this.blogService.likeBlog(id).subscribe(data => {
    this.getAllBlogs(); // Refresh blogs after like.
  });
}
  ngOnInit() {
    this.getAllBlogs();
  }

}
