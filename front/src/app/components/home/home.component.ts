import { Component, OnInit } from '@angular/core';
import { BlogService } from "../../services/blog.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  newBlogPost;

  constructor(
    private blogSerivce: BlogService
  ) {
    }

  getAllBlogs() {
    this.blogSerivce.getAllBlogs().subscribe(data => {
      this.newBlogPost = data.blog
    })
  }

  ngOnInit() {

    this.getAllBlogs();
  }

}
