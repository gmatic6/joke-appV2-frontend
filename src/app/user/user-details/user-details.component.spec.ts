import { UserService } from '../../user/user.service';
import { JokeService } from '../../joke/joke.service';
import { SpectatorRouting, createRoutingFactory, createHttpFactory, SpectatorHttp, SpyObject } from '@ngneat/spectator/jest';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { JokeComponent } from '../../joke/joke-list/joke-list.component';
import { UserComponent } from '../../user/user-list/user-list.component';
import { UserDetailsComponent } from '../../user/user-details/user-details.component';
import { JokeDetailsComponent } from '../../joke/joke-details/joke-details.component';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { User } from 'src/app/user/user';
import { Joke } from 'src/app/joke/joke';

describe('Component: UserDetailsComponent', () => {
  const httpService: () => SpectatorHttp<UserDetailsComponent> = createHttpFactory<UserDetailsComponent>(UserDetailsComponent);

  let userService: SpyObject<UserService>;
  let jokeService: SpyObject<JokeService>;

  let spectator: SpectatorRouting<UserDetailsComponent>;

  const createComponent = createRoutingFactory<UserDetailsComponent>({
    component: UserDetailsComponent,
    imports: [FormsModule, AppRoutingModule],
    declarations: [JokeDetailsComponent, JokeComponent, UserComponent],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}],
    mocks: [JokeService, UserService],
  });

  beforeEach(() => {
    spectator = createComponent({detectChanges: false});
    userService = spectator.get<UserService>(UserService);
    jokeService = spectator.get<JokeService>(JokeService);
  });

  it('exists', () => {
    const { service } = httpService();
    expect(service).toBeDefined();
    expect(spectator.component).toBeDefined();
  });

  it('can get jokes by user', () => {
    userService.jokesByUser.andReturn(of([]));
    spectator.component.jokesByUser(new User());
    expect(userService.jokesByUser).toHaveBeenCalled();
  });

  it('can like a joke', () => {
    jokeService.likeJoke.andReturn(of());
    const joke = new Joke();
    joke.id = 0;
    joke.likes = 1;
    spectator.component.userJokes = [];
    spectator.component.userJokes.push(joke);
    spectator.component.like(joke);
    expect(jokeService.likeJoke).toHaveBeenCalledWith(joke);
    expect(spectator.component.userJokes[0].likes).toEqual(2);
  });
});
