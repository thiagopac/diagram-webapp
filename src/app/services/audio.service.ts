import { Inject, Injectable } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(@Inject(APP_BASE_HREF) private baseHref: string) { }

  capture: IPlayable = new Multiplay(this.getAsset('audio/Capture.mp3'), 3);
  move: IPlayable = new Multiplay(this.getAsset('audio/Move.mp3'), 3);
  genericNotify: IPlayable = new Audio(this.getAsset('audio/GenericNotify.mp3'));

  playMoveSound(captured: boolean) {
    if (captured) {
      return this.capture.play();
    }
    return this.move.play();
  }

  private getAsset(assetDir: string) {
    return `${this.baseHref}assets/${assetDir}`;
  }
}

class Multiplay implements IPlayable {
  private ct = 0;
  private audios: Array<HTMLAudioElement> = [];

  constructor(src: string, amount: number) {
    for (let i = 0; i < amount; ++i) {
      this.audios.push(new Audio(src));
    }
  }

  async play() {
    this.audios[this.ct].play();
    this.ct = (this.ct + 1) % this.audios.length;
  }
}


export interface IPlayable {
  play(): Promise<void>;
}
