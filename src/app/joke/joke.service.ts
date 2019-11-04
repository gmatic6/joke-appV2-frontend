import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Joke } from './joke';
import { MessageService } from '../message.service';
import { User } from '../user/user';
import 'core-js/es7/reflect';

@Injectable({
  providedIn: 'root'
})
export class JokeService {

  private jokesUrl = 'http://localhost:8080/jokes';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    ) { }

  getJokes(): Observable<Joke[]> {
    return this.http.get<Joke[]>(this.jokesUrl).pipe(
        tap(_ => this.log('Fetched jokes')),
        catchError(this.handleError<Joke[]>('getJokes', []))
    );
  }

  getJoke(id: number): Observable<Joke> {
    const url = `${this.jokesUrl}/${id}`;
    return this.http.get<Joke>(url).pipe(
      tap(_ => this.log(`Fetched joke with id = ${id}`)),
      catchError(this.handleError<Joke>(`getJoke id = ${id}`))
    );
  }

  updateJoke(joke: Joke): Observable<any> {
    const url = `${this.jokesUrl}/${joke.id}`;
    return this.http.put(url, joke, this.httpOptions).pipe(
      tap(_ => this.log(`Updated joke with id = ${joke.id}`)),
      catchError(this.handleError<any>(`updateJoke`))
    );
  }

  addJoke(joke: Joke, user: User): Observable<Joke> {
    joke.user = user;
    return this.http.post<Joke>(this.jokesUrl, joke, this.httpOptions).pipe(
      tap((newJoke: Joke) => this.log(`Added joke with id = ${newJoke.id}`)),
      catchError(this.handleError<Joke>('addJoke'))
    );
  }

  deleteJoke(joke: Joke | number): Observable<Joke> {
    const id = typeof joke === 'number' ? joke : joke.id;
    const url = `${this.jokesUrl}/${id}`;

    return this.http.delete<Joke>(url, this.httpOptions).pipe(
      tap(_ => this.log(`Deleted joke with id = ${id}`)),
      catchError(this.handleError<Joke>('deleteJoke'))
    );
  }

  likeJoke(joke: Joke | number): Observable<Joke> {
    const id = typeof joke === 'number' ? joke : joke.id;
    const url = `${this.jokesUrl}/${id}/like`;

    return this.http.put(url, joke, this.httpOptions).pipe(
      tap(_ => this.log(`Liked joke with id = ${id}`)),
      catchError(this.handleError<any>(`likeJoke`))
    );
  }

  dislikeJoke(joke: Joke | number): Observable<Joke> {
    const id = typeof joke === 'number' ? joke : joke.id;
    const url = `${this.jokesUrl}/${id}/dislike`;

    return this.http.put(url, joke, this.httpOptions).pipe(
      tap(_ => this.log(`Disliked joke with id = ${id}`)),
      catchError(this.handleError<any>(`dislikeJoke`))
    );
  }

  getJotd(): Observable<Joke> {
    return this.http.get<Joke>(`${this.jokesUrl}?jotd`).pipe(
      tap(_ => this.log(`Fetched joke of the day`)),
      catchError(this.handleError<Joke>(`getJotd`))
    );
  }

  getTop5(): Observable<Joke[]> {
    return this.http.get<Joke[]>(`${this.jokesUrl}?top=5`).pipe(
        tap(_ => this.log('Fetched top 5')),
        catchError(this.handleError<Joke[]>('getTop5', []))
    );
  }

  getGood(): Observable<Joke[]> {
    return this.http.get<Joke[]>(`${this.jokesUrl}?good`).pipe(
        tap(_ => this.log('Fetched good jokes')),
        catchError(this.handleError<Joke[]>('getGood', []))
    );
  }

  getBad(): Observable<Joke[]> {
    return this.http.get<Joke[]>(`${this.jokesUrl}?bad`).pipe(
        tap(_ => this.log('Fetched bad jokes')),
        catchError(this.handleError<Joke[]>('getBad', []))
    );
  }

  getRandom(): Observable<Joke> {
    return this.http.get<Joke>(`${this.jokesUrl}?random`).pipe(
      tap(_ => this.log(`Fetched random joke`)),
      catchError(this.handleError<Joke>(`getRandom`))
    );
  }

  favourite(joke: Joke, user: User): Observable<User> {
    const url = `${this.jokesUrl}/${joke.id}/fav?user=${user.id}`;

    return this.http.put(url, joke, this.httpOptions).pipe(
      tap(_ => this.log(`Favourited joke with id = ${joke.id} by user ${user.username}`)),
      catchError(this.handleError<any>(`favourite`))
    );
  }

  unfavourite(joke: Joke, user: User): Observable<User> {
    const url = `${this.jokesUrl}/${joke.id}/unfav?user=${user.id}`;

    return this.http.put(url, joke, this.httpOptions).pipe(
      tap(_ => this.log(`Unfavourited joke with id = ${joke.id} by user ${user.username}`)),
      catchError(this.handleError<any>(`unfavourite`))
    );
  }

  favouritedBy(joke: Joke): Observable<User[]> {
    const url = `${this.jokesUrl}/${joke.id}/favs`;

    return this.http.get<User[]>(url).pipe(
      tap(_ => this.log(`Users that favourited joke with id = ${joke.id}`)),
      catchError(this.handleError<User[]>(`favouritedBy`))
    );
  }

  log(message: string) {
    this.messageService.add(`JokeService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
