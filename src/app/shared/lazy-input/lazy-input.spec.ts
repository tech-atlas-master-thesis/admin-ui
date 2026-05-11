import { TestBed } from '@angular/core/testing';

import { LazyInput } from './lazy-input';

describe('LazyInput', () => {
  let service: LazyInput;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LazyInput);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
