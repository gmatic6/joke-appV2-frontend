import { Component, OnInit, OnDestroy } from '@angular/core';

import { Joke } from '../joke';
import { JokeService } from '../joke.service';
import { User } from 'src/app/user/user';
import { UserService } from 'src/app/user/user.service';
import { Subscription } from 'rxjs';
import 'core-js/es7/reflect';

@Component({
  selector: 'app-joke',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.css']
})
export class JokeComponent implements OnInit, OnDestroy {

  jokes: Joke[];
  selectedJoke: Joke;
  addForm = false;
  users: User[];
  isFaved: number[];
  activeUser: User;
  subscriptions: Subscription[] = [];

  constructor(
    private jokeService: JokeService,
    private userService: UserService
  ) { }

  onSelect(joke: Joke): void {
    this.selectedJoke = joke;
  }

  getJokes(): void {
    this.addForm = false;
    this.subscriptions.push(this.jokeService.getJokes().subscribe(jokes => {
      this.jokes = jokes;
      this.isFavourited();
    }));
  }

  addJoke(jokeText: string): void {
    jokeText = jokeText.trim();
    if (!jokeText) { return; }
    this.subscriptions.push(this.jokeService.addJoke({jokeText} as Joke, this.activeUser).subscribe(joke => {
      this.jokes.push(joke);
      this.getJokes();
    }));
    this.addForm = false;
  }

  delete(joke: Joke): void {
    this.jokes = this.jokes.filter(j => j !== joke);
    this.subscriptions.push(this.jokeService.deleteJoke(joke).subscribe(j => {
      this.getJokes();
    }));
  }

  getJotd(): void {
    this.addForm = false;
    this.subscriptions.push(this.jokeService.getJotd().subscribe(jotd => {
      this.jokes.splice(0, this.jokes.length, jotd);
      this.isFavourited();
    }));
  }

  getTop5(): void {
    this.addForm = false;
    this.subscriptions.push(this.jokeService.getTop5().subscribe(jokes => {
      this.jokes = jokes;
      this.isFavourited();
    }));
  }

  getGood(): void {
    this.addForm = false;
    this.subscriptions.push(this.jokeService.getGood().subscribe(jokes => {
      this.jokes = jokes;
      this.isFavourited();
    }));
  }

  getBad(): void {
    this.addForm = false;
    this.subscriptions.push(this.jokeService.getBad().subscribe(jokes => {
      this.jokes = jokes;
      this.isFavourited();
    }));
  }

  getRandom(): void {
    this.addForm = false;
    this.subscriptions.push(this.jokeService.getRandom().subscribe(random => {
      this.jokes.splice(0, this.jokes.length, random);
      this.isFavourited();
    }));
  }

  like(joke: Joke): void {
    const index = this.jokes.findIndex(j => j.id === joke.id);
    this.jokes[index].likes++;
    this.subscriptions.push(this.jokeService.likeJoke(joke).subscribe());
  }

  dislike(joke: Joke): void {
    const index = this.jokes.findIndex((j => j.id === joke.id));
    this.jokes[index].dislikes++;
    this.subscriptions.push(this.jokeService.dislikeJoke(joke).subscribe());
  }

  addJokeForm(): void {
    this.jokes.length = 0;
    this.addForm = true;
  }

  favourite(joke: Joke): void {
    const index = this.jokes.findIndex((j => j.id === joke.id));
    this.isFaved[index] = 1;
    this.subscriptions.push(this.jokeService.favourite(joke, this.activeUser).subscribe());
  }

  unfavourite(joke: Joke): void {
    const index = this.jokes.findIndex((j => j.id === joke.id));
    this.isFaved[index] = 0;
    this.subscriptions.push(this.jokeService.unfavourite(joke, this.activeUser).subscribe());
  }

  isFavourited(): void {
    this.isFaved = [];
    for (let i = 0; i < this.jokes.length; i++) {
      this.users = Array.from(this.jokes[i].favouritedBy);
      for (const user of this.users) {
        if (user.id === this.activeUser.id) {
          this.isFaved[i] = 1;
        } else {
          this.isFaved[i] = 0;
        }
      }
    }
  }

  ngOnInit() {
    this.getJokes();
    this.subscriptions.push(this.userService.getActiveUser().subscribe(u => this.activeUser = u));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
