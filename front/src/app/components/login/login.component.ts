import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AuthGuard } from "../../guards/auth.guard";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {


// ==========================================================
// 		             VARIABLES
// ==========================================================
  form: FormGroup;
  loginMessage;
  loginMessageClass;
  processing = false;
  previousUrl;


// ==========================================================
// 		             CONSTRUCTOR
// ==========================================================
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
      this.createForm(); // Load the login form when the component is loaded.
    }

// ==========================================================
// 		             CREATE FORM METHOD
// ==========================================================
  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], // Validate the username field.
      password: ['', Validators.required] // Validate the password field.
    })
  }


// ==========================================================
// 		             ENABLE FORM
// ==========================================================
  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }


// ==========================================================
// 		             DISABLE FORM
// ==========================================================
  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }


// ==========================================================
// 		            LOGIN
// ==========================================================
  loginUser() {
    this.processing = true; // True Locks the login button when proccessing.
    this.disableForm();
    // Get the input values and store it in user object.
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    // Subscribe to the login method from service.
    this.authService.loginUser(user).subscribe(data => {
      // Check if the API responds with error.
      if(!data.success){
        this.processing = false; // Set the proccesing to false to unlock the form and login button.
        this.loginMessage = data.message; // Give the error message from API.
        this.loginMessageClass = 'alert error-alert'; // Set the class to error.
        this.enableForm(); // Enable the the form for edit.
      }else{
        this.processing = true; // Set to true to lock the login button.
        this.loginMessage = data.message; // Give the success message from API.
        this.loginMessageClass = 'alert success-alert'; // Change the class to success.
        this.disableForm();
        this.authService.storeUserData(data.token, data.user); // Use this method to Store the token and user info coming from API.
        setTimeout(() => {
          // Check if user first attempted to access a different url which is defined in the authGuard.
          if(this.previousUrl){
            // If there is a first attempted url, navigate to that url.
            this.router.navigate([this.previousUrl]);
          }else{
            this.router.navigate(['/dashboard']); // After two second navigate to dashboard.
          }
        }, 2000);
      }
    })
  }



// ==========================================================
// 		                     LIFE CYCLE
// ==========================================================

  ngOnInit() {
    // Use the authguard stored url variable that if there is a url.
    if(this.authGuard.redirectUrl) {
      // If there is a url, set the class to red color.
      this.loginMessageClass = "alert error-alert";
      // Inform the user they need to login before accessing the route.
      this.loginMessage = "You must be logged in to view this page. ";
      // Set the url to the stored url.
      this.previousUrl = this.authGuard.redirectUrl;
      // Clear the url otherwise user will always be routed to that url.
      this.authGuard.redirectUrl = undefined;
    }

  }

}
