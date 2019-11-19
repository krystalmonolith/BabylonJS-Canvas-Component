import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphapulsarBabylonjsLibComponent } from './alphapulsar-babylonjs-lib.component';

describe('AlphapulsarBabylonjsLibComponent', () => {
  let component: AlphapulsarBabylonjsLibComponent;
  let fixture: ComponentFixture<AlphapulsarBabylonjsLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlphapulsarBabylonjsLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphapulsarBabylonjsLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
