import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  // Variables
  domain = "http://localhost:8080";
  user;

  constructor(
    private http: Http
  ) { }

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

}
