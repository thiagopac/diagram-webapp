import 'zone.js/dist/zone-testing';
import { MessageData } from '../shared/peer-to-peer/defs';
import { BROADCAST_FINISH_DELAY, createPeers } from '../mocks/services/peer-to-peer-helpers';
import { PeerToPeerServiceMock } from '../mocks/services/peer-to-peer.service.mock';
import { PeerToPeerService } from './peer-to-peer.service';


describe('PeerToPeerService', () => {
  let peers: PeerToPeerServiceMock[];
  const sampleCommand: MessageData = {
    command: 'DISCONNECTED',
    name: 'myname'
  };

  beforeEach(() => {
    peers = createPeers(1);
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(peers[0]).toBeTruthy();
  });

  it('messages do not echo by default', () => {
    peers[1].broadcast(sampleCommand);
    jasmine.clock().tick(BROADCAST_FINISH_DELAY);

    expect(peers[1].messageHistory).toEqual([]);
  });

  it('messages do echo', () => {
    peers[1].broadcast(sampleCommand, {echo: true});

    jasmine.clock().tick(BROADCAST_FINISH_DELAY);
    expect(peers[1].messageHistory).not.toEqual([]);
    expect(peers[1].messageHistory[0].data).toEqual(sampleCommand);
  });

  it('runs OK when not initialised', () => {
    const service = new PeerToPeerService();
    expect(service.getId()).not.toBeNull();
    service.broadcast({command: 'START'});
    service.sendSingleMessage('aaa', {command: 'START'});
  });
});
