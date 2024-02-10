import { PeerToPeerServiceMock } from './peer-to-peer.service.mock';

export const BROADCAST_FINISH_DELAY = 1000 * 2;

export function createPeers(numberOfClients: number) {
  const peers: PeerToPeerServiceMock[] = [];

  const hostPeer = new PeerToPeerServiceMock();
  hostPeer.setState({
    isHost: true,
    alias: 'host',
    isConnected: true
  });
  hostPeer.peerIdOverride = 'hostId';
  hostPeer.hostIdOverride = hostPeer.getId();

  function addClient(alias: string) {
    const clientPeer = new PeerToPeerServiceMock();
    clientPeer.setState({
      isHost: false,
      alias
    });
    clientPeer.peerIdOverride = alias + 'Id';
    clientPeer.hostIdOverride = hostPeer.getId();
    hostPeer.addConnection(clientPeer);
    clientPeer.addConnection(hostPeer);
    return clientPeer;
  }

  peers.push(hostPeer);
  for (let i = 1; i <= numberOfClients; ++i) {
    const clientPeer = addClient(`client${i}`);
    clientPeer.messageSendTimeMs = 250 + 50 * i;
    peers.push(clientPeer);
  }
  return peers;
}
