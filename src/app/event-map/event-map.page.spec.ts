import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventMapPage } from './event-map.page';

describe('EventMapPage', () => {
  let component: EventMapPage;
  let fixture: ComponentFixture<EventMapPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
