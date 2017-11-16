import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { BlogService } from '../../../services/blog.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.sass']
})
export class EditBlogComponent implements OnInit {


/*==========================================================
                       VARIABLES
==========================================================*/

  currentUrl; // Stores the single blog url/id.
  editMessageClass
  editMessage;
  proccessing = false;
  edittedBlog;
  timer;

  blog = {
    title: String,
    body: String
  }

/*==========================================================
                    CONTSTRUCTOR
==========================================================*/
  constructor(
    private blogService: BlogService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) { }

  /*==========================================================
                      UPDATE METHOD
  ==========================================================*/
  updateBlog() {
    this.proccessing = true; // Locks the input fields and buttons.

    // Sending a PUT request to update the blog using updateBlog in the blogService.
    this.blogService.updateBlog(this.blog).subscribe(data => {
      // Check if the operation is successful.
      if(!data.success){
        this.proccessing = false; // Unlock everything
        this.editMessageClass = 'alert error-alert'; // Give the error class.
        this.editMessage = data.message; // Respond with the error message from API.
      }else{
        this.proccessing = true; // Lock everything if the operation is success.
        this.editMessageClass = 'alert success-alert'; // Give the success class.
        this.editMessage = data.message; // Give the success message from API.
        this.edittedBlog = data.blog; // Take the updated blog and pass it next to the display message.
        this.timer = setTimeout(() => { // Assigning the time out to timer variable so we stop the router navtigation operation if user clicks on the updated blog link.
          this.editMessageClass = null; // Remove the display div.
          this.editMessage = null; //
          this.router.navigate(['/']);
        }, 5000);
      }
    })
  }

/*==========================================================
                    CLEAR TIMEOUT
==========================================================*/
  // This method is setting on updated blog link. If the user clicks on the link, this function also fires to clear the timeout to stop the routing operation.
  clearTimeOut() {
    clearTimeout(this.timer);
  }


/*==========================================================
                    GO BACK
==========================================================*/
  goBack() {
    this.location.back();
  }

  ngOnInit() {

/*==========================================================
                    GET UNIQUE URL ID
==========================================================*/
    // Grab the current blog url from the browser.
    this.currentUrl = this.activatedRoute.snapshot.params;

    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      this.blog = data.blog;
    })
  }

}
