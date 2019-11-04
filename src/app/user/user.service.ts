import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from './user';
import { Joke } from '../joke/joke';
import { MessageService } from '../message.service';
import 'core-js/es7/reflect';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'http://localhost:8080/users';
  private activeUser = new BehaviorSubject(new User());
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  setActiveUser(user: User) {
    this.activeUser.next(user);
  }

  getActiveUser() {
    return this.activeUser;
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  getUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`Fetched User with id = ${id}`)),
      catchError(this.handleError<User>(`getUser id = ${id}`))
    );
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.usersUrl}/${user.id}`, user, this.httpOptions).pipe(
      tap(_ => this.log(`Updated User with id=${user.id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  addUser(username: string, password: string): Observable<User> {
    if (!username) { return of() as Observable<User>; }
    const user = new User();
    user.password = password;
    user.username = username;
    return this.http.post<User>(this.usersUrl, user, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`Added user with id = ${newUser.id}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  deleteUser(user: User | number): Observable<User> {
    const id = typeof user === 'number' ? user : user.id;
    const url = `${this.usersUrl}/${id}`;

    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap(_ => this.log(`Deleted User with id = ${id}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  jokesByUser(user: User | number): Observable<Joke[]> {
    const id = typeof user === 'number' ? user : user.id;
    const url = `${this.usersUrl}/${id}/jokes`;

    return this.http.get<Joke[]>(url).pipe(
        catchError(this.handleError<Joke[]>('getJokesByUser', []))
      );
  }

  favourites(user: User): Observable<Joke[]> {
    const url = `${this.usersUrl}/${user.id}/favs`;
    return this.http.get<Joke[]>(url).pipe(
      catchError(this.handleError<Joke[]>('favourites', []))
    );
  }

  userByUsername(username: string): Observable<User> {
    const url = `${this.usersUrl}/?username=${username}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`Fetched User with username = ${username}`)),
      catchError(this.handleError<User>(`getUserByUsername = ${username}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`UserService: ${message}`);
  }
}
