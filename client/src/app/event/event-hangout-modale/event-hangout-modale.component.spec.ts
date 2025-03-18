import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventHangoutModaleComponent } from './event-hangout-modale.component';

describe('EventHangoutModaleComponent', () => {
  let component: EventHangoutModaleComponent;
  let fixture: ComponentFixture<EventHangoutModaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventHangoutModaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventHangoutModaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
