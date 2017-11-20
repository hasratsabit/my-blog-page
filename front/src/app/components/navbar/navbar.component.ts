import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  username;
  newPostLink = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private location: Location
  ) { }


  onLogoutUser() {
    this.authService.logoutUser();
    this.flashMessagesService.show('You are logged out.', { cssClass: 'alert success-alert'});
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(data => {
      this.username = data.user.username;
      this.newPostLink = true;
    })
  }

}
