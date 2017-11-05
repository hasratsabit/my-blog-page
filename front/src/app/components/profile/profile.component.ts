import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  name = '';
  username = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(data => {
      this.name = data.user.name;
      this.username = data.user.username;
      this.email = data.user.email;
      this.password = data.user.password.replace(/./g,'*'); // The replace method transform the password into astric 
    })
  }

}
