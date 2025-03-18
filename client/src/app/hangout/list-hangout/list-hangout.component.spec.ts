import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHangoutComponent } from './list-hangout.component';

describe('ListHangoutComponent', () => {
  let component: ListHangoutComponent;
  let fixture: ComponentFixture<ListHangoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHangoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHangoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
