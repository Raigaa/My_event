import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangoutOrganizeComponent } from './hangout-organize.component';

describe('HangoutOrganizeComponent', () => {
  let component: HangoutOrganizeComponent;
  let fixture: ComponentFixture<HangoutOrganizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangoutOrganizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangoutOrganizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
