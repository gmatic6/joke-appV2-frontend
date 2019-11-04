import { JokeService } from '../joke.service';
import { UserService } from '../../user/user.service';
import { SpectatorRouting, createRoutingFactory, SpyObject } from '@ngneat/spectator/jest';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { JokeComponent } from '../joke-list/joke-list.component';
import { UserComponent } from '../../user/user-list/user-list.component';
import { UserDetailsComponent } from '../../user/user-details/user-details.component';
import { JokeDetailsComponent } from '../joke-details/joke-details.component';
import { APP_BASE_HREF } from '@angular/common';
import { of, Observable } from 'rxjs';
import { User } from 'src/app/user/user';

describe('Component: JokeComponent', () => {
  let jokeService: SpyObject<JokeService>;
  let userService: SpyObject<UserService>;

  let spectator: SpectatorRouting<JokeComponent>;

  const createComponent = createRoutingFactory<JokeComponent>({
    component: JokeComponent,
    imports: [FormsModule, AppRoutingModule],
    declarations: [JokeDetailsComponent, UserComponent, UserDetailsComponent],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}],
    mocks: [JokeService, UserService],
  });

  beforeEach(() => {
    spectator = createComponent({detectChanges: false});
    jokeService = spectator.get<JokeService>(JokeService);
    userService = spectator.get<UserService>(UserService);
  });

  it('exists', () => {
    expect(spectator.component).toBeDefined();
  });

  it('does initialization', () => {
    const user = new User();
    userService.getActiveUser.andReturn(of(user) as Observable<User>);
    jokeService.getJokes.andReturn(of([]));
    spectator.component.ngOnInit();
    expect(spectator.component.activeUser).toEqual(user);
    expect(spectator.component.jokes).toEqual([]);
  });

  it('can get jokes', () => {
    jokeService.getJokes.andReturn(of([]));
    spectator.component.getJokes();
    expect(jokeService.getJokes).toHaveBeenCalled();
  });

  it('can add jokes', () => {
    jokeService.addJoke.andReturn(of([]));
    const user = new User();
    user.username = 'test';
    spectator.component.activeUser = user;
    spectator.component.jokes = [];
    spectator.component.addJoke('test');
    expect(jokeService.addJoke).toHaveBeenCalledWith({jokeText: 'test'}, {username: 'test'});
    expect(spectator.component.jokes.length).toEqual(1);
  });

});
