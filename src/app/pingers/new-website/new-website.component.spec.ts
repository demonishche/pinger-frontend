import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWebsiteComponent } from './new-website.component';

describe('NewWebsiteComponent', () => {
  let component: NewWebsiteComponent;
  let fixture: ComponentFixture<NewWebsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewWebsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
