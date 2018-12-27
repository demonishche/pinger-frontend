import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveWebsiteComponent } from './remove-website.component';

describe('RemoveWebsiteComponent', () => {
  let component: RemoveWebsiteComponent;
  let fixture: ComponentFixture<RemoveWebsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveWebsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
