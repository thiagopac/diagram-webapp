import { Mock } from 'typemoq';
import { AudioService, IPlayable } from '../services/audio.service';

export function getAudioServiceMock(): AudioService {
  const m = Mock.ofType<AudioService>();
  m.setup(t => t.capture).returns(() => Mock.ofType<IPlayable>().object);
  m.setup(t => t.genericNotify).returns(() => Mock.ofType<IPlayable>().object);
  m.setup(t => t.move).returns(() => Mock.ofType<IPlayable>().object);

  return m.object;
}

