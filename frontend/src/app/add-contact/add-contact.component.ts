import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from '../services/contact.service';
import * as moment from 'moment';

interface Contact {
  name: string;
  ph_no: string;
  email: string;
  profile_pic: string;
  bday: string;
  address: string;
  category: {
    mainCategory: string;
    subcategory: string;
  };
  contactid: number;
}

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css'],
})
export class AddContactComponent implements OnInit {
  newContact: Contact = {
    name: '',
    ph_no: '',
    email: '',
    profile_pic: '',
    bday: '',
    address: '',
    category: {
      mainCategory: 'Personal',
      subcategory: 'Family',
    },
    contactid: 0,
  };

  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  phoneRegex = /^[0-9]{10}$/;
  selectedDate: string = '';  

  constructor(
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {}

  onDateChange(event: any): void {
    const inputDate = event.target.value;
    if (inputDate) {
      const formattedDate = moment(inputDate).format('DD-MM-YYYY');
      this.newContact.bday = formattedDate;
    } else {
      this.newContact.bday = '';
    }
  }

  onCategoryChange(): void {
    if (this.newContact.category.mainCategory === 'Personal') {
      this.newContact.category.subcategory = 'Family';
    } else if (this.newContact.category.mainCategory === 'Professional') {
      this.newContact.category.subcategory = 'Colleagues';
    } else if (this.newContact.category.mainCategory === 'Others') {
      this.newContact.category.subcategory = 'Acquaintances';
    }
  }

  generateRandomContactId(): number {
    return Math.floor(Math.random() * 1000000000);
  }

  validateContact(contact: Contact): boolean {
    if (!contact.name || !contact.ph_no || !contact.email || !contact.address || !contact.bday) {
      alert('Please fill in all the required fields.');
      return false;
    }

    if (!this.phoneRegex.test(contact.ph_no)) {
      alert('Please enter a valid phone number (10 digits).');
      return false;
    }

    if (!this.emailRegex.test(contact.email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    if (!moment(contact.bday, 'DD-MM-YYYY', true).isValid()) {
      alert('Please enter a valid date in DD-MM-YYYY format.');
      return false;
    }

    return true;
  }

  addContact(): void {
    if (!this.newContact.category.mainCategory || !this.newContact.category.subcategory) {
      alert('Please select both a category and a subcategory.');
      return;
    }

    const contactToSubmit = {
      ...this.newContact,
      contactid: this.generateRandomContactId()
    };

    if (!this.validateContact(contactToSubmit)) {
      return;
    }

    console.log('Contact data being submitted:', contactToSubmit);

    this.contactService.createContact(contactToSubmit).subscribe(
      (response) => {
        alert('Contact added successfully');
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error adding contact:', error);
        if (error.status === 400) {
          console.error('Backend error response:', error.error);
          alert('Failed to add contact. Reason: ' + (error.error.message || 'Invalid data'));
        } else {
          alert('An unexpected error occurred');
        }
      }
    );
  }

  cancelAdd(): void {
    this.router.navigate(['/home']);
  }
}
