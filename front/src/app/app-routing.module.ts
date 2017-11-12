import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { HomeComponent } from "./components/home/home.component";
import { BlogComponent } from "./components/blog/blog.component";
import { EditBlogComponent } from "./components/blog/edit-blog/edit-blog.component";
import { DeleteBlogComponent } from "./components/blog/delete-blog/delete-blog.component";
import { ReadMoreComponent } from "./components/blog/read-more/read-more.component";

import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/notAuth.guard";

const appRoutes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'blogs',
		component: BlogComponent
	},
	{
		path: 'edit-blog/:id',
		component: EditBlogComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'delete-blog/:id',
		component: DeleteBlogComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'read-more/:id',
		component: ReadMoreComponent
	},
	{
		path: 'register',
		component: RegisterComponent,
		canActivate: [NotAuthGuard]
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [NotAuthGuard]
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'profile',
		component: ProfileComponent,
		canActivate: [AuthGuard]
	}
]


@NgModule({
	declarations: [],
	imports: [ RouterModule.forRoot(appRoutes)],
	providers:[],
	bootstrap: [],
	exports: [RouterModule]

})

export class AppRoutingModule {}
