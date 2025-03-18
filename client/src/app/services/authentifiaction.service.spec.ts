import { TestBed } from '@angular/core/testing';

import { AuthentifiactionService } from './authentifiaction.service';

describe('AuthentifiactionService', () => {
  let service: AuthentifiactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthentifiactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
