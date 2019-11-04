import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JokeComponent } from './joke/joke-list/joke-list.component';
import { UserComponent } from './user/user-list/user-list.component';
import { JokeDetailsComponent } from './joke/joke-details/joke-details.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';

const routes: Routes = [
  { path: 'jokes', component: JokeComponent },
  { path: 'users', component: UserComponent },
  { path: 'jokes/:id', component: JokeDetailsComponent },
  { path: 'users/:id', component: UserDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
