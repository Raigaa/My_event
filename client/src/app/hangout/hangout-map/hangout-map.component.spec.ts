import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangoutMapComponent } from './hangout-map.component';

describe('HangoutMapComponent', () => {
  let component: HangoutMapComponent;
  let fixture: ComponentFixture<HangoutMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangoutMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangoutMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
