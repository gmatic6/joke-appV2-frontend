import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JokeComponent } from './joke/joke-list/joke-list.component';
import { UserComponent } from './user/user-list/user-list.component';
import { JokeDetailsComponent } from './joke/joke-details/joke-details.component';
import { MessageComponent } from './message/message.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AppComponent,
    JokeComponent,
    UserComponent,
    JokeDetailsComponent,
    MessageComponent,
    UserDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
