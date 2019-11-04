import { SpectatorService, SpyObject, createService } from '@netbasal/spectator/jest';
import { createHTTPFactory, SpectatorHTTP } from '@netbasal/spectator/jest';
import { HTTPMethod } from '@netbasal/spectator';
import { MessageService } from '../message.service';
import { JokeService } from './joke.service';

describe('Service: JokeService', () => {
  const httpService: () => SpectatorHTTP<JokeService> = createHTTPFactory<JokeService>(JokeService);

  let messageService: SpyObject<MessageService>;

  const spectator: SpectatorService<JokeService> = createService({
    service: JokeService,
    mocks: [MessageService]
  });

  beforeEach(() => {
    messageService = spectator.get(MessageService);
  });

  it('exists', () => {
    const { dataService } = httpService();
    expect(dataService).toBeDefined();
    expect(spectator.service).toBeDefined();
  });

  it('can log a message to MessageService', () => {
    spectator.service.log('test message');
    expect(messageService.add).toHaveBeenCalledWith('JokeService: test message');
  });

  it('can get jokes from the server', () => {
    const { dataService, expectOne } = httpService();

    dataService.getJokes().subscribe();
    expectOne('http://localhost:8080/jokes', HTTPMethod.GET);
  });
});
