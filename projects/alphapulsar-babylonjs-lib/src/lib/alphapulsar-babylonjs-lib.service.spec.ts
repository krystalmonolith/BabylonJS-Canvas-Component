import { TestBed } from '@angular/core/testing';

import { AlphapulsarBabylonjsLibService } from './alphapulsar-babylonjs-lib.service';

describe('AlphapulsarBabylonjsLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlphapulsarBabylonjsLibService = TestBed.get(AlphapulsarBabylonjsLibService);
    expect(service).toBeTruthy();
  });
});
