import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import 'core-js/es7/reflect';

@Component({
  selector: 'app-user',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  users: User[];
  activeUser: User;
  addForm = false;
  username: string;
  subscriptions: Subscription[] = [];

  getUsers(): void {
    this.addForm = false;
    this.subscriptions.push(this.userService.getUsers().subscribe(users => this.users = users));
  }

  addUserForm(): void {
    this.users = [];
    this.addForm = true;
  }
  addUser(username: string, password: string): void {
    username = username.trim();
    password = password.trim();
    if (!username) { return; }
    this.subscriptions.push(this.userService.addUser(username, password).subscribe(
      user => {
        this.users.push(user);
        this.getUsers();
      }));
  }

  delete(user: User): void {
    this.users = this.users.filter(u => u !== user);
    this.subscriptions.push(this.userService.deleteUser(user).subscribe());
  }

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
