import { ReplaceNullWithEmptyPipe } from './replace-null-with-empty.pipe';

describe('ReplaceNullWithEmptyPipe', () => {
  it('create an instance', () => {
    const pipe = new ReplaceNullWithEmptyPipe();
    expect(pipe).toBeTruthy();
  });
});
