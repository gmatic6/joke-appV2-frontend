import { JokeService } from '../joke.service';
import { UserService } from '../../user/user.service';
import { SpectatorRouting, createRoutingFactory, SpyObject } from '@ngneat/spectator/jest';
import { JokeDetailsComponent } from './joke-details.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { JokeComponent } from '../joke-list/joke-list.component';
import { UserComponent } from '../../user/user-list/user-list.component';
import { UserDetailsComponent } from '../../user/user-details/user-details.component';
import { APP_BASE_HREF } from '@angular/common';
import { of, Observable } from 'rxjs';
import { Joke } from '../joke';
import { User } from 'src/app/user/user';

describe('Component: JokeDetailsComponent', () => {
  let jokeService: SpyObject<JokeService>;
  let userService: SpyObject<UserService>;

  let spectator: SpectatorRouting<JokeDetailsComponent>;

  const createComponent = createRoutingFactory<JokeDetailsComponent>({
    component: JokeDetailsComponent,
    imports: [FormsModule, AppRoutingModule],
    declarations: [JokeComponent, UserComponent, UserDetailsComponent],
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
    const joke = new Joke();
    joke.jokeText = 'test';
    const user = new User();
    user.username = 'test';
    jokeService.getJoke.andReturn(of(joke) as Observable<Joke>);
    userService.getActiveUser.andReturn(of(user) as Observable<User>);
    spectator.component.ngOnInit();

    expect(spectator.component.joke).toEqual(joke);
    expect(spectator.component.activeUser).toEqual(user);
  });

  it('can save a joke', () => {
    jokeService.updateJoke.andReturn(of() as Observable<Joke>);
    spectator.component.save();
    expect(jokeService.updateJoke).toHaveBeenCalled();
  });
});
