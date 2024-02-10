import { Injectable } from '@angular/core';
import { IMessage } from 'src/app/shared/peer-to-peer/defs';
import { PeerToPeerService } from '../../services/peer-to-peer.service';


@Injectable()
export class PeerToPeerServiceMock extends PeerToPeerService {
  peerIdOverride = '';
  hostIdOverride = '';
  messageSendTimeMs = 200;
  messageHistory: IMessage[] = [];

  getId = () => this.peerIdOverride;
  getHostId = () => this.hostIdOverride;

  setState(data: {isHost?: boolean, alias?: string, isConnected?: boolean}) {
    if (data.isHost !== undefined) this.isHost = data.isHost;
    if (data.alias !== undefined) this.alias = data.alias;
    if (data.isConnected !== undefined) this.isConnected = data.isConnected;
  }

  addConnection(p: PeerToPeerServiceMock) {
    console.log(`Add connection ${p.getId()}`, this.connections);
    this.connections[p.getId()] = jasmine.createSpyObj('DataConnection', ['send'], {
      send: (m: IMessage) => {
        setTimeout(() => {
          console.log(`Message ${this.getId()} -> ${p.getId()} ${m.data.command}`, m);
          p.messageHandler(m);
        }, this.messageSendTimeMs);
      }
    });
  }

  messageHandler(m: IMessage) {
    this.messageHistory.push(m);
    return super.messageHandler(m);
  }
}
