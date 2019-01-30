import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PingersListComponent } from './pingers-list.component';

describe('PingersListComponent', () => {
  let component: PingersListComponent;
  let fixture: ComponentFixture<PingersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PingersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PingersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
