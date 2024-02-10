export interface IEngine {
  postMessage(s: string): void;
  addMessageListener(fn: ((line: string) => void)): void;
}
