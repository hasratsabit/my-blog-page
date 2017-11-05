import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) { }


  onLogoutUser() {
    this.authService.logoutUser();
    this.flashMessagesService.show('You are logged out.', { cssClass: 'alert success-alert'});
    this.router.navigate(['/']);
  }

  ngOnInit() {
  }

}
