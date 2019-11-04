import { UserService } from '../../user/user.service';
import { SpectatorRouting, createRoutingFactory, SpyObject } from '@ngneat/spectator/jest';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { JokeComponent } from '../../joke/joke-list/joke-list.component';
import { UserComponent } from '../../user/user-list/user-list.component';
import { UserDetailsComponent } from '../../user/user-details/user-details.component';
import { JokeDetailsComponent } from '../../joke/joke-details/joke-details.component';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { User } from 'src/app/user/user';


describe('Component: UserComponent', () => {
  let userService: SpyObject<UserService>;

  let spectator: SpectatorRouting<UserComponent>;

  const createComponent = createRoutingFactory<UserComponent>({
    component: UserComponent,
    imports: [FormsModule, AppRoutingModule],
    declarations: [JokeDetailsComponent, JokeComponent, UserDetailsComponent],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}],
    mocks: [UserService],
  });

  beforeEach(() => {
    spectator = createComponent({detectChanges: false});
    userService = spectator.get<UserService>(UserService);
  });

  it('exists', () => {
    expect(spectator.component).toBeDefined();
  });

  it('does initialization', () => {
    userService.getUsers.andReturn(of([]));
    spectator.component.ngOnInit();
    expect(userService.getUsers).toHaveBeenCalled();
  });

  it('can get users', () => {
    userService.getUsers.andReturn(of([]));
    spectator.component.getUsers();
    expect(userService.getUsers).toHaveBeenCalled();
  });

  it('can add users', () => {
    userService.addUser.andReturn(of([]));
    const user = new User();
    user.username = 'test';
    spectator.component.users = [];
    spectator.component.addUser('test', 'test');
    expect(userService.addUser).toHaveBeenCalledWith('test', 'test');
    expect(spectator.component.users.length).toEqual(1);
  });
});
