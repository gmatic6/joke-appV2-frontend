import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Joke } from '../joke';
import { JokeService } from '../joke.service';
import { UserService } from 'src/app/user/user.service';
import { User } from 'src/app/user/user';
import { Subscription } from 'rxjs';
import 'core-js/es7/reflect';

@Component({
  selector: 'app-joke-details',
  templateUrl: './joke-details.component.html',
  styleUrls: ['./joke-details.component.css']
})
export class JokeDetailsComponent implements OnInit, OnDestroy {
  @Input() joke: Joke;
  editor = false;
  activeUser: User;

  subscriptions: Subscription[] = [];

  save(): void {
    this.subscriptions.push(this.jokeService.updateJoke(this.joke).subscribe(() => this.goBack()));
  }

  goBack(): void {
    this.location.back();
  }

  edit() {
    this.editor = true;
  }

  constructor(
    private route: ActivatedRoute,
    private jokeService: JokeService,
    private userService: UserService,
    private location: Location,
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.jokeService.getJoke(id).subscribe(joke => this.joke = joke));
    this.subscriptions.push(this.userService.getActiveUser().subscribe(u => this.activeUser = u));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
