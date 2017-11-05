import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { tokenNotExpired } from "angular2-jwt";
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  // Variables
  domain = "http://localhost:8080";
  user;
  authToken;
  options;

  constructor(
    private http: Http
  ) { }

  // ==========================================================
  // 		             STORE USER DATA
  // ==========================================================

    // This will be used in the login component to store the use info and token in the browser which is comming from API.
    storeUserData(token, user){
      localStorage.setItem('token', token); // The name is token and stores the token.
      localStorage.setItem('user', JSON.stringify(user)); // The name is user and stores the user.
      this.authToken = token; // Assign the token to a variable to use in other methods.
      this.user = user; // Assign the user to a variable to use in other methods.
    }


  // ==========================================================
  // 		             LOAD TOKEN
  // ==========================================================

    // This method loads token from the browser which is stored by storeUserData when user signed in.

    loadToken(){
      this.authToken = localStorage.getItem('token');
    }


  // ==========================================================
  // 		             AUTHORIZATION HEADERS
  // ==========================================================
    createAuthorizationHeader() {
      this.loadToken(); // Call the method to load the token from browser.
      this.options = new RequestOptions({ // Create options.
        headers: new Headers({
          'Content-Type': 'application/json', // The content type is JSON.
          'authorization': this.authToken // For authorization pass the authToken.
        })
      })
    }

// ==========================================================
// 		                REGISTER USER
// ==========================================================
  registerUser(user) {
    return this.http.post(this.domain + '/authentication/registerUser', user).map(res => res.json());
  }

// ==========================================================
// 		             CHECK EMAIL AVAILABLITY
// ==========================================================
  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json());
  }

// ==========================================================
// 		             CHECK EMAIL AVAILABLITY
// ==========================================================
  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
  }


// ==========================================================
// 		             LOGIN REQUEST
// ==========================================================
  loginUser(user) {
    return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  }


// ==========================================================
// 		             LOGOUT USER
// ==========================================================

  logoutUser() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

// ==========================================================
// 		             ROUTE ACCESS METHOD
// ==========================================================

  userLoggedIn() {
    return tokenNotExpired();
  }

// ==========================================================
// 		             GET PROFILE REQUEST
// ==========================================================
  getProfile() {
    this.createAuthorizationHeader();
    return this.http.get(this.domain + '/authentication/userProfile', this.options).map(res => res.json());
  }




}
