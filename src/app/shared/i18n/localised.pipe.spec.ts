import { LocalisedPipe } from './localised.pipe';

describe('LocalisedPipe', () => {
  it('create an instance', () => {
    const pipe = new LocalisedPipe();
    expect(pipe).toBeTruthy();
  });
});
