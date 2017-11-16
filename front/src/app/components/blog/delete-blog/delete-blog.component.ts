import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { BlogService } from "../../../services/blog.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.sass']
})
export class DeleteBlogComponent implements OnInit {

  currentUrl;
  deleteMessageClass;
  deleteMessage;
  showModel = false;
  turnOnModelClass;

  blog = {
    title: String,
    createdBy: String,
  }
  constructor(
    private location: Location,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }


  onDeleteBlog() {
    this.blogService.deleteBlog(this.currentUrl.id).subscribe(data => {
      this.showModel = false;
      if(!data.success){
        this.showModel = true;
        this.deleteMessage = data.message;
        this.deleteMessageClass = 'alert error-alert';
      }else{
        this.showModel = false;
        this.deleteMessage = data.message;
        this.deleteMessageClass = 'alert success-alert';
        setTimeout(() => {
          this.router.navigate(['/blogs']);
        }, 3000);
      }
    })
  }

  goBack() {
    this.location.back();
  }
  ngOnInit() {
    this.turnOnModelClass = 'model--show-model';
    this.showModel = true;
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      this.blog = data.blog;
    })

  }

}
