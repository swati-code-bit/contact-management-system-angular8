import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../services/contact.service';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  contactId: string = '';
  contact: any = {
    name: '',
    ph_no: '',
    email: '',
    profile_pic: '',
    bday: '',
    address: '',
    category: {
      mainCategory: '',
      subcategory: '',
    },
  };

  subcategoryOptions: string[] = [];
  phoneRegex: string = '^[0-9]{10}$';
  emailRegex: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.contactId = this.route.snapshot.paramMap.get('id')!;
    console.log('Contact ID:', this.contactId);

    this.contactService.getContactById(this.contactId).subscribe(
      (contact) => {
        this.contact = contact;

        if (!this.contact.category) {
          this.contact.category = { mainCategory: '', subcategory: '' };
        }

        this.onMainCategoryChange();

        if (this.contact.bday) {
          this.contact.bday = this.convertToDateInputFormat(this.contact.bday);
        }
      },
      (error) => {
        console.error('Error fetching contact:', error);
      }
    );
  }

  onMainCategoryChange(): void {
    switch (this.contact.category.mainCategory) {
      case 'Personal':
        this.subcategoryOptions = ['Family', 'Friends'];
        break;
      case 'Professional':
        this.subcategoryOptions = ['Colleagues', 'Clients', 'Business Partners'];
        break;
      case 'Others':
        this.subcategoryOptions = ['Acquaintances'];
        break;
      default:
        this.subcategoryOptions = [];
        break;
    }

    if (!this.subcategoryOptions.includes(this.contact.category.subcategory)) {
      this.contact.category.subcategory = '';
    }
  }

  convertToDateInputFormat(date: string): string {
    const formattedDate = moment(date, 'DD-MM-YYYY', true).isValid()
      ? moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
      : '';
    return formattedDate;
  }

  saveContact(): void {
    if (this.contact.bday) {
      this.contact.bday = moment(this.contact.bday, 'YYYY-MM-DD').isValid()
        ? moment(this.contact.bday).format('YYYY-MM-DD')
        : '';
    }

    this.contactService.updateContact(this.contactId, this.contact).subscribe(
      (updatedContact) => {
        console.log('Contact updated successfully');
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error updating contact:', error);
        alert('An error occurred while updating the contact. Please try again.');
      }
    );
  }

  cancelEdit(): void {
    this.router.navigate(['/home']);
  }

  onDateChange(event: any) {
    this.contact.bday = event.target.value;
  }
}
