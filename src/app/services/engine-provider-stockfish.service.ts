import { Injectable } from '@angular/core';
import { getLogger } from '../services/logger';
import { IEngine } from '../shared/engine/IEngine';
import { IEngineProvider } from '../shared/engine/IEngineProvider';

const logger = getLogger('engine-provider-stockfish');

@Injectable({
  providedIn: 'root'
})
export class EngineProviderStockfishService implements IEngineProvider {

  constructor() { }

  async getEngine(): Promise<IEngine> {
    if (this.wasmThreadsSupported()) {
      logger.info('wasm stockfish');
      // @ts-ignore
      return await Stockfish();
    }
    const legacyStockfish = new StockfishLegacyWrapper();
    logger.info(`single threaded stockfish ${legacyStockfish.wasmSupported ? 'wasm' : 'nowasm'}`);
    return legacyStockfish;
  }

  private wasmThreadsSupported() {
    // WebAssembly 1.0
    const source = Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00);
    if (
      typeof WebAssembly !== 'object' ||
      typeof WebAssembly.validate !== 'function'
    )
    {
      return false;
    }
    if (!WebAssembly.validate(source)) return false;

    // SharedArrayBuffer
    if (typeof SharedArrayBuffer !== 'function') return false;

    // Atomics
    if (typeof Atomics !== 'object') return false;

    // Shared memory
    // @ts-ignore
    const mem = new WebAssembly.Memory({ shared: true, initial: 8, maximum: 16 });
    if (!(mem.buffer instanceof SharedArrayBuffer)) return false;

    // Structured cloning
    try {
      // You have to make sure nobody cares about these messages!
      window.postMessage(mem, '*');
    } catch (e) {
      return false;
    }

    // Growable shared memory (optional)
    try {
      mem.grow(8);
    } catch (e) {
      return false;
    }

    return true;
  }
}


class StockfishLegacyWrapper implements IEngine {
  readonly worker: Worker;
  readonly wasmSupported: boolean;
  constructor() {
    this.wasmSupported = typeof WebAssembly === 'object'
      && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
    this.worker = new Worker(this.wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js');
  }

  postMessage(s: string): void {
    this.worker.postMessage(s);
  }

  addMessageListener(fn: ((line: string) => void)): void {
    this.worker.onmessage = (ev: MessageEvent<any>) => {
      fn(ev.data);
    };
  }
}
