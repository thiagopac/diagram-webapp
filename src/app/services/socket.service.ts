import { Injectable } from '@angular/core';
import { log } from 'console';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  //tests - sending
  poke(text: string) {
    this.socket.emit('poke', text);
  }

  //test - receiving
  onPoke() {
    return this.socket.fromEvent('poke');
  }

  createGame(game: any) {
    console.log('createGame: ', game);
    this.socket.emit('game:create', { data: game });
  }

  deleteGame(game: any) {
    console.log('deleteGame: ', game);
    this.socket.emit('game:delete', { data: game });
  }

  joinGame(game: any) {
    console.log('joinGame: ', game);
    this.socket.emit('game:join', { data: game });
  }

  listInvites() {
    this.socket.emit('invite:list');
  }

  onInvitesListed() {
    return this.socket.fromEvent('invite:listed');
  }

  onInvitesError() {
    return this.socket.fromEvent('invite:error');
  }
}
