import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts-toolbar',
  templateUrl: './contacts-toolbar.component.html',
  styleUrls: ['./contacts-toolbar.component.css'],
})
export class ContactsToolbarComponent {
  showFilter: boolean = false;

  constructor(private router: Router) {}

  navigateToAddContact(): void {
    this.router.navigate(['/add-contact']);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }
}
