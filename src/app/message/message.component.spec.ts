import { MessageComponent } from './message.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
describe('Component: MessageComponent', () => {
  let spectator: Spectator<MessageComponent>;

  const createComponent = createComponentFactory<MessageComponent>({
    component: MessageComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('exists', () => {
    expect(spectator.component).toBeDefined();
  });
});
