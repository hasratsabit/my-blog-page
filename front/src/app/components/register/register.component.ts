import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  // ==========================================================
  // 		 									VARIABLES
  // ==========================================================
  form;
  registerMessage;
  registerMessageClass;
  availableEmail;
  availableEmailMessage
  availableUsername;
  availableUsernameMessage;
  proccessing = false;

  // ==========================================================
  // 		 									CONSTRUCTOR
  // ==========================================================
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthService
  ) {
    this.createForm(); // Invoke the function when page loads to create the form.
  }


  // ==========================================================
  // 		 							CREATE FORM VALIDATOR
  // ==========================================================
  createForm() {
    this.form = this.formBuilder.group({
      // Name
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        this.validateName
      ])],

      // Username
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],

      // Email
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        this.validateEmail
      ])],

      // Password
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],

      // Confirm
      confirm: ['', Validators.required] // Field is required
    }, { validator: this.matchingPassword('password', 'confirm') })
  }


  // ==========================================================
  // 		 									VALIDATE NAME
  // ==========================================================
  validateName(controls) {
    // Valid email expression.
    const regExp = new RegExp(/^[a-zA-Z ]+$/);
    if(regExp.test(controls.value)){
      return null; // Set error to null if the given name meets the expression.
    }else{
      return { 'validateName': true } //  Return true for error if the name is not according to the expression.
    }
  }


  // ==========================================================
  // 		 									VALIDATE USERNAME
  // ==========================================================
  validateUsername(controls) {
    // Valid username expression.
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Check if the username is valid.
    if(regExp.test(controls.value)){
      return null; // Return no error if it is a valid username.
    }else{
      return { 'validateUsername': true } // Return the error true, if it is not a valid username.
    }
  }


  // ==========================================================
  // 		 									VALIDATE EMAIL
  // ==========================================================
  validateEmail(controls) {
    // Valid email expression.
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test user's email if it meets a valid email condition.
    if(regExp.test(controls.value)){
      return null; // If the email is valid, no error.
    }else{
      return { 'validateEmail': true } // If the condition is not met, return true for erorr.
    }
  }



  // ==========================================================
  // 		 									VALIDATE PASSWORD
  // ==========================================================
  validatePassword(controls){
    // Password testing expression.
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    // Check if the password meets the expression rules.
    if(regExp.test(controls.value)){
      return null; // If meets the condition, no error.
    }else{
      return {'validatePassword': true } // If doesn't meet the condition, make error true.
    }
  }

  // ==========================================================
  // 		 							MATCH CONFIRM AND PASSWORD
  // ==========================================================
  matchingPassword(password, confirm) {
    return (group: FormGroup) => {
      // Check if the password and confirm are the same.
      if(group.controls[password].value === group.controls[confirm].value){
        return null // If the inputs are the same, set to no error.
      }else{
        return { 'matchingPassword': true } // If password inputs are different, make error true.
      }
    }
  }


  // ==========================================================
  // 		 									ENABLE FORM
  // ==========================================================
  enableForm() {
    this.form.controls['name'].enable()
    this.form.controls['username'].enable()
    this.form.controls['email'].enable()
    this.form.controls['password'].enable()
    this.form.controls['confirm'].enable()
  }


  // ==========================================================
  // 		 									DISABLE FORM
  // ==========================================================
  disableForm() {
    this.form.controls['name'].disable()
    this.form.controls['username'].disable()
    this.form.controls['email'].disable()
    this.form.controls['password'].disable()
    this.form.controls['confirm'].disable()
  }


// ==========================================================
// 		 					CHECK EMAIL AVAILABLITY
// ==========================================================
  checkAvailableEmail() {
    // Use authService to check if email is not already in database.
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      // Check if the email already exists in database.
      if(!data.success){
        this.availableEmail = false; // Set to false if email is already taken.
        this.availableEmailMessage = data.message; // Respond with API message if email is already taken.
      }else{
        this.availableEmail = true; // Set to true if email is available.
        this.availableEmailMessage = data.message; // Respond with with available email API message.
      }
    })
  }



// ==========================================================
// 		 					CHECK USERNAME AVAILABLITY
// ==========================================================
  checkAvailableUsername() {
    // Use authService to check if username is not already in database.
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      // Check if the username already exists in database.
      if(!data.success){
        this.availableUsername = false; // Set to false if username is already taken.
        this.availableUsernameMessage = data.message; // Respond with API message if username is already taken.
      }else{
        this.availableUsername = true; // Set to true if username is available.
        this.availableUsernameMessage = data.message; // Respond with with available username API message.
      }
    })
  }


// ==========================================================
// 		 					REGISTER USER FUNCTION
// ==========================================================
  registerUser() {

    this.proccessing = true;
    this.disableForm(); // When proccessing, disable form.

    // Store the input field values in user object.
    const user = {
      name: this.form.get('name').value,
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }

    // Post user using the registerUser method in the service.
    this.authService.registerUser(user).subscribe(data => {
      // Check if it returns error.
      if(!data.success){
        this.registerMessage = data.message; // Respond with errors message from API.
        this.registerMessageClass = "alert error-alert"; // Give the error class in the template.
        this.proccessing = false; // Set the proccessing to false to unlock the form.
        this.enableForm(); // Unlock the form.
      }else{
        this.registerMessage = data.message; // Give the success message from API.
        this.registerMessageClass = "alert success-alert"; // Set the alert to success class in the template.
        this.proccessing = true; // Make the proccessing true to unlock fields.
        this.disableForm(); // Disable the form.
        // Set timeout for 2 second.
        setTimeout(() => {
          this.router.navigate(['/login']); // Route to login page after two second.
        }, 2000);
      }
    })
  }

  ngOnInit() {
  }

}
