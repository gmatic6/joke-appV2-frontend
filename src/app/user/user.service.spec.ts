import { createHTTPFactory, SpectatorHTTP } from '@netbasal/spectator/jest';
import { HTTPMethod } from '@netbasal/spectator';

import { UserService } from './user.service';

describe('Service: UserService', () => {
  const httpService: () => SpectatorHTTP<UserService> = createHTTPFactory<UserService>(UserService);

  it('exists', () => {
    const { dataService } = httpService();
    expect(dataService).toBeDefined();
  });

  it('can get users from the server', () => {
    const { dataService, expectOne } = httpService();

    dataService.getUsers().subscribe();
    expectOne('http://localhost:8080/users', HTTPMethod.GET);
  });

  it('can get a user by id', () => {
    const { dataService, expectOne } = httpService();

    dataService.getUser(5).subscribe();
    expectOne('http://localhost:8080/users/5', HTTPMethod.GET);
  });

  it('can jokes from selected user', () => {
    const { dataService, expectOne } = httpService();

    dataService.jokesByUser(4).subscribe();
    expectOne('http://localhost:8080/users/4/jokes', HTTPMethod.GET);
  });
});
