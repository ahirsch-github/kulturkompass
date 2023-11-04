import { TestBed } from '@angular/core/testing';

import { KulturdatenService } from './kulturdaten.service';

describe('KulturdatenService', () => {
  let service: KulturdatenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KulturdatenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
