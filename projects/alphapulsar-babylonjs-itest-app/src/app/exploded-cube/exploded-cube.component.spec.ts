import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplodedCubeComponent } from './exploded-cube.component';

describe('ExplodedCubeComponent', () => {
  let component: ExplodedCubeComponent;
  let fixture: ComponentFixture<ExplodedCubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplodedCubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplodedCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
