import { SpectatorService, SpyObject, createService } from '@netbasal/spectator/jest';
import { MessageService } from './message.service';

describe('Service: MessageService', () => {
  let messageService: SpyObject<MessageService>;

  const spectator: SpectatorService<MessageService> = createService({
    service: MessageService,
    mocks: [MessageService]
  });

  beforeEach(() => {
    messageService = spectator.get(MessageService);
  });

  it('exists', () => {
    expect(spectator.service).toBeDefined();
  });

  it('can post a message', () => {
    spectator.service.add('test message');
    expect(messageService.add).toHaveBeenCalledWith('test message');
  });

});

