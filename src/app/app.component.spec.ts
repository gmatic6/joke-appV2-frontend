import { Observable, of } from 'rxjs';
import { AppComponent } from './app.component';
import { JokeService } from './joke/joke.service';
import { UserService } from './user/user.service';
import { SpectatorRouting, createRoutingFactory, createHttpFactory, SpectatorHttp, HttpMethod, SpyObject } from '@ngneat/spectator/jest';
import { User } from './user/user';

describe('Component: AppComponent', () => {
  const httpService: () => SpectatorHttp<AppComponent> = createHttpFactory<AppComponent>(AppComponent);

  let jokeService: SpyObject<JokeService>;
  let userService: SpyObject<UserService>;

  let spectator: SpectatorRouting<AppComponent>;

  const createComponent = createRoutingFactory<AppComponent>({
    component: AppComponent,
    mocks: [JokeService, UserService],
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent();
    jokeService = spectator.get<JokeService>(JokeService);
    userService = spectator.get<UserService>(UserService);
  });

  it('exists', () => {
    const { service } = httpService();
    expect(service).toBeDefined();
    expect(spectator.component).toBeDefined();
  });

  it('can send a login request', () => {
    const { service, expectOne } = httpService();
    service.login();
    expectOne('http://localhost:8080/login', HttpMethod.POST);
  });

  it('can send a register request', () => {
    const { service } = httpService();
    userService.addUser.andReturn(of() as Observable<User>);
    spectator.component.username = 'test';
    spectator.component.register();
    expect(userService.addUser).toHaveBeenCalled();
  });

  it('can send a logout request', () => {
    const { service, expectOne } = httpService();
    service.logout();
    expectOne('http://localhost:8080/logout', HttpMethod.POST);
  });
});
