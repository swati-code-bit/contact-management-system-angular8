import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactDynamicComponent } from './add-contact-dynamic.component';

describe('AddContactDynamicComponent', () => {
  let component: AddContactDynamicComponent;
  let fixture: ComponentFixture<AddContactDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContactDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContactDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
