import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { BlogService } from '../../../services/blog.service';
import { AuthService } from '../../../services/auth.service';
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
  username;
  blog = {}
  newComment = false;

  constructor(
    private blogService: BlogService,
    private location: Location,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute

  ) { }


  likeBlog(id) {
    this.blogService.likeBlog(id).subscribe(data => {
      this.ngOnInit();
    })
  }

  postComment() {
    this.newComment = true;
  }

  cancelComment() {
    this.newComment = false;
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {

    // Grab the current blog url from the browser.
    this.currentUrl = this.activatedRoute.snapshot.params;

    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      this.blog = data.blog;
    })

    this.authService.getProfile().subscribe(data => {
      this.username = data.user.username;
    })
  }

}
