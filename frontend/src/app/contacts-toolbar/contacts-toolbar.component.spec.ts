import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsToolbarComponent } from './contacts-toolbar.component';

describe('ContactsToolbarComponent', () => {
  let component: ContactsToolbarComponent;
  let fixture: ComponentFixture<ContactsToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
