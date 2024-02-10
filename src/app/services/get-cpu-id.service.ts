import { Injectable } from '@angular/core';
import { PeerToPeerService } from './peer-to-peer.service';

@Injectable({
  providedIn: 'root'
})
export class GetCpuIdService {
  private count = 0;

  constructor(private peerToPeerService: PeerToPeerService) { }

  getNewCpuId() {
    return `${this.peerToPeerService.getId()}_sf${this.count++}`;
  }
}
