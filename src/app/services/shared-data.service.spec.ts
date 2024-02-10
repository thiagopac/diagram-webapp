import 'zone.js/dist/zone-testing';
import { SharedDataService } from './shared-data.service';
import {
  BROADCAST_FINISH_DELAY,
  createPeers,
} from '../mocks/services/peer-to-peer-helpers';
import { GetCpuIdService } from './get-cpu-id.service';
import { CommandService } from './command.service';
import { UsernameProperties } from 'src/app/shared/util/username';

describe('sharedDataService', () => {
  let service1: SharedDataService;
  let service2: SharedDataService;

  beforeAll(() => {
    jasmine.clock().install();
    const peers = createPeers(2);

    const cpuIdService1 = new GetCpuIdService(peers[0]);
    const cpuIdService2 = new GetCpuIdService(peers[1]);
    service1 = new SharedDataService(peers[0]);
    service2 = new SharedDataService(peers[1]);
    const commandService1 = new CommandService(
      service1,
      peers[0],
      cpuIdService1
    );
    const commandService2 = new CommandService(
      service2,
      peers[1],
      cpuIdService2
    );

    commandService1.createPlayer(
      {
        properties: {} as UsernameProperties,
        name: 'p1',
        team: 'white',
        sortNumber: 0,
        owner: peers[0].getId(),
        isReady: false,
      },
      peers[0].getId()
    );
    commandService2.createPlayer(
      {
        properties: {} as UsernameProperties,
        name: 'p2',
        team: 'white',
        sortNumber: 0,
        owner: peers[1].getId(),
        isReady: false,
      },
      peers[1].getId()
    );

    jasmine.clock().tick(BROADCAST_FINISH_DELAY);
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service1).toBeTruthy();
  });

  it('Simple single-writer player properties', () => {
    expect(service1.getPlayerSync('hostId').isReady).toBe(false);
    expect(service2.getPlayerSync('hostId').isReady).toBe(false);
    service1.setIsReady(true);
    jasmine.clock().tick(BROADCAST_FINISH_DELAY);
    expect(service1.getPlayerSync('hostId').isReady).toBe(true);
    expect(service2.getPlayerSync('hostId').isReady).toBe(true);
  });

  it('concurrency with multi-writer on SHARED data', () => {
    service1.setSharedData({ timerSettings: { whiteTime: 0 } });
    jasmine.clock().tick(BROADCAST_FINISH_DELAY);

    expect(service1.getSharedDataSync().timerSettings?.whiteTime).toBe(0);
    expect(service2.getSharedDataSync().timerSettings?.whiteTime).toBe(0);

    service1.setSharedData({ timerSettings: { whiteTime: 50 } });
    service2.setSharedData({ timerSettings: { whiteTime: 60 } });
    jasmine.clock().tick(BROADCAST_FINISH_DELAY);

    expect(service1.getSharedDataSync().timerSettings?.whiteTime).toBe(
      60,
      'service1'
    );
    expect(service2.getSharedDataSync().timerSettings?.whiteTime).toBe(
      60,
      'service2'
    );
  });

  it('concurrency with multi-writer on PLAYER data', () => {
    service1.broadcastNamesMessage(
      { engineSettings: { timeForMove: 51 } },
      { id: 'client1Id' }
    );
    jasmine.clock().tick(BROADCAST_FINISH_DELAY);
    service1.setEngineSettings('client1Id', { timeForMove: 50 });
    jasmine.clock().tick(BROADCAST_FINISH_DELAY);

    expect(
      service1.getPlayerSync('client1Id').engineSettings?.timeForMove
    ).toBe(50);
    expect(
      service2.getPlayerSync('client1Id').engineSettings?.timeForMove
    ).toBe(50);

    service1.setEngineSettings('client1Id', { timeForMove: 51 });
    service2.setEngineSettings('client1Id', { timeForMove: 52 });
    jasmine.clock().tick(BROADCAST_FINISH_DELAY);

    expect(
      service1.getPlayerSync('client1Id').engineSettings?.timeForMove
    ).toBe(52);
    expect(
      service1.getPlayerSync('client1Id').engineSettings?.timeForMove
    ).toBe(52);
  });
});
