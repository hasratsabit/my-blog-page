import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";


@Injectable()
export class AuthGuard implements CanActivate {

	redirectUrl;

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	canActivate(
		router: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	) {
		// Check if the user is already loggedin.
		if(this.authService.userLoggedIn()) {
			return true; // If the user is loggedin, allow access to the restricted routes.
		}else{
			// Store the url that user was trying to access.
			this.redirectUrl = state.url;
			// If the user is not logged in, route to login so the user logs in.
			this.router.navigate(['/login']);
			return false;
		}
	}
}
