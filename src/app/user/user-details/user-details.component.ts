import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../user';
import { UserService } from '../user.service';
import { Joke } from '../../joke/joke';
import { JokeService } from '../../joke/joke.service';
import { Subscription } from 'rxjs';
import 'core-js/es7/reflect';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  @Input() user: User;
  editor = false;
  showJokes = false;
  userJokes: Joke[] = [];
  isFaved: number[];
  users = [];
  activeUser = new User();
  jokesPosted: number;
  totalLikes = 0;
  totalDislikes = 0;
  subscriptions: Subscription[] = [];

  save(user: User): void {
    this.subscriptions.push(this.userService.updateUser(this.user).subscribe(() => this.goBack()));
    this.userService.setActiveUser(this.user);
  }

  promote(user: User): void {
    user.role = 'ADMIN';
    this.save(user);
  }

  goBack(): void {
    this.location.back();
  }

  delete(user: User) {
    if (user.username === this.activeUser.username) {
      this.userService.setActiveUser(new User());
    }
    this.subscriptions.push(this.userService.deleteUser(user).subscribe(() => this.goBack()));
  }

  jokesByUser(user: User): void {
    this.subscriptions.push(this.userService.jokesByUser(user).subscribe(jokes => {
      this.userJokes = jokes;
      this.jokesPosted = this.userJokes.length;
      if (this.totalLikes === 0 && this.totalDislikes === 0) {
        for (const joke of this.userJokes) {
          this.totalLikes += joke.likes;
          this.totalDislikes += joke.dislikes;
        }
      }
      this.isFavourited();
    }));
  }

  like(joke: Joke): void {
    const index = this.userJokes.findIndex(j => j.id === joke.id);
    this.userJokes[index].likes++;
    this.subscriptions.push(this.jokeService.likeJoke(joke).subscribe());
  }

  dislike(joke: Joke): void {
    const index = this.userJokes.findIndex((j => j.id === joke.id));
    this.userJokes[index].dislikes++;
    this.subscriptions.push(this.jokeService.dislikeJoke(joke).subscribe());
  }

  deleteJoke(joke: Joke): void {
    this.userJokes = this.userJokes.filter(j => j !== joke);
    this.subscriptions.push(this.jokeService.deleteJoke(joke).subscribe());
  }

  favourites(user: User): void {
    this.subscriptions.push(this.userService.favourites(user).subscribe(jokes => {
      this.userJokes = jokes;
      this.isFavourited();
    }));
  }

  favourite(joke: Joke): void {
    const index = this.userJokes.findIndex((j => j.id === joke.id));
    this.isFaved[index] = 1;
    this.subscriptions.push(this.jokeService.favourite(joke, this.activeUser).subscribe());
  }

  unfavourite(joke: Joke): void {
    const index = this.userJokes.findIndex((j => j.id === joke.id));
    this.isFaved[index] = 0;
    this.subscriptions.push(this.jokeService.unfavourite(joke, this.activeUser).subscribe());
  }

  isFavourited(): void {
    this.isFaved = [];
    for (let i = 0; i < this.userJokes.length; i++) {
      this.users = Array.from(this.userJokes[i].favouritedBy);
      for (const user of this.users) {
        if (user.id === this.activeUser.id) {
          this.isFaved[i] = 1;
        } else {
          this.isFaved[i] = 0;
        }
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private jokeService: JokeService,
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.userService.getActiveUser().subscribe(u => this.activeUser = u));
    this.subscriptions.push(this.userService.getUser(id).subscribe(user => {
      this.user = user;
      this.jokesByUser(user);
    }));
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
