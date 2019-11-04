import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user/user.service';
import { User } from './user/user';
import { JokeService } from './joke/joke.service';
import { Joke } from './joke/joke';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import 'core-js/es7/reflect';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'jokeapp';
  activeUser = new User();
  users: User[];
  jokes: Joke[];
  jokeOfTheDay: Joke;
  top5: Joke[];
  subscriptions: Subscription[] = [];
  username: string;
  password: string;
  loginFailed = false;
  topics = ['com.combis.jokeApp.services', 'com.combis.jokeApp.controller'];
  topic = 'com.combis.jokeApp.services';
  levels = ['INFO', 'WARN', 'DEBUG', 'TRACE', 'ERROR', 'OFF'];
  level = {configuredLevel: 'INFO'};
  setClicked = false;

  constructor(
    private userService: UserService,
    private jokeService: JokeService,
    public router: Router,
    private http: HttpClient,
  ) {}

  login(): void {
    const url = `http://localhost:8080/login`;
    this.http.post(url, `username=${this.username}&password=${this.password}`,
    {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}), observe: 'response'})
    .pipe(
      flatMap(res => {
        return this.userService.userByUsername(this.username);
      }))
      .subscribe(u => {
        this.postLogin(u);
      },
      err => {
        this.loginFailed = true;
      });
  }

  register(): void {
    this.subscriptions.push(this.userService.addUser(this.username, this.password).subscribe(
      user => {
        if (!user.username) { return; }
        this.login();
      }));
  }

  logout(): void {
    const url = `http://localhost:8080/logout`;
    this.http.post(url, null).subscribe();
  }

  setLevel(): void {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const url = `http://localhost:8080/actuator/loggers/${this.topic}`;
    this.subscriptions.push(this.http.post(url, this.level, httpOptions).subscribe(x => this.setClicked = true));
  }

  postLogin(user: User): void {
    this.subscriptions.push(this.jokeService.getJotd().subscribe(jotd => this.jokeOfTheDay = jotd));
    this.subscriptions.push(this.jokeService.getTop5().subscribe(top => this.top5 = top));
    this.subscriptions.push(this.userService.getUsers().subscribe(u => this.users = u));
    this.subscriptions.push(this.userService.getActiveUser().subscribe(u => this.activeUser = u));
    this.userService.setActiveUser(user);
    this.subscriptions.push(this.jokeService.getJokes().subscribe(j => this.jokes = j));
  }

  ngOnInit() {}

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
