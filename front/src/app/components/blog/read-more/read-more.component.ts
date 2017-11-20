import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { BlogService } from '../../../services/blog.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.sass']
})
export class ReadMoreComponent implements OnInit {

  currentUrl; // Stores the single blog url/id.
  readMoreClass;
  readMoreMessage;
  blogLikes;
  blog = {
    title: String,
    body: String,
    author: String,
    date: Date,
    likes: Number,
    commentNum: Number
  }

  constructor(
    private blogService: BlogService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) { }

  ngOnInit() {

    // Grab the current blog url from the browser.
    this.currentUrl = this.activatedRoute.snapshot.params;

    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      this.blog = data.blog;
      this.blogLikes = data.blog.likedBy;
      console.log(this.blogLikes);
    })
  }

}
