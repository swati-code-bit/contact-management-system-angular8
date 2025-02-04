import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from '../services/contact.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-contact-table',
  templateUrl: './contact-table.component.html',
  styleUrls: ['./contact-table.component.css'],
})
export class ContactTableComponent implements OnInit, OnDestroy {
  contacts: any[] = [];
  searchResults: any[] = [];
  filteredContacts: any[] = [];
  private contactsUpdatedSubscription: Subscription | null = null;
  private filterSubscription: Subscription | null = null;
  sortDirection: { [key: string]: 'asc' | 'desc' | undefined } = {};
  currentFilters: any = {
    categories: [],
    startDate: '',
    endDate: '',
  };

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;

  pageIndex: number = 0;
  pageSize: number = 10;

  constructor(
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchContacts();

    this.contactsUpdatedSubscription =
      this.contactService.contactsUpdated$.subscribe(() => {
        this.fetchContacts();
      });

    this.filterSubscription = this.contactService.filterUpdated$.subscribe(
      (filters) => {
        this.currentFilters = filters;
        this.applyFilters(this.currentFilters);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.contactsUpdatedSubscription) {
      this.contactsUpdatedSubscription.unsubscribe();
    }
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  fetchContacts(): void {
    this.contactService.getContacts().subscribe(
      (data) => {
        this.contacts = data;
        this.searchResults = [...this.contacts];
        this.applyFilters(this.currentFilters);
        this.applySorting();
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  deleteContact(contactId: string): void {
    const confirmation = confirm(
      'Are you sure you want to delete this contact?'
    );
    if (confirmation) {
      this.contactService.deleteContact(contactId).subscribe(
        () => {
          this.contacts = this.contacts.filter(
            (contact) => contact._id !== contactId
          );
          this.searchResults = this.searchResults.filter(
            (contact) => contact._id !== contactId
          );
          this.applyFilters(this.currentFilters);
          this.applySorting();
        },
        (error) => {
          console.error('Error deleting contact:', error);
        }
      );
    }
  }

  editContact(contactId: string): void {
    this.fetchContacts();
    this.applySorting();
    this.applyFilters(this.currentFilters);
  }

  sortContacts(column: string, event: Event): void {
    event.preventDefault();
    const currentDirection = this.sortDirection[column];

    Object.keys(this.sortDirection).forEach((key) => {
      if (key !== column) {
        this.sortDirection[key] = undefined;
      }
    });

    if (currentDirection === 'asc') {
      this.sortDirection[column] = 'desc';
    } else if (currentDirection === 'desc') {
      this.sortDirection[column] = undefined;
    } else {
      this.sortDirection[column] = 'asc';
    }

    this.applySorting();
  }

  applySorting(): void {
    if (Object.values(this.sortDirection).every((value) => value === undefined)) {
      this.filteredContacts = [...this.searchResults];
    } else {
      this.filteredContacts = this.filteredContacts.sort((a, b) => {
        if (this.sortDirection['category']) {
          const mainCategoryA = a.category.mainCategory.toLowerCase();
          const mainCategoryB = b.category.mainCategory.toLowerCase();
          return this.sortDirection['category'] === 'asc'
            ? mainCategoryA.localeCompare(mainCategoryB)
            : mainCategoryB.localeCompare(mainCategoryA);
        } else {
          const column = Object.keys(this.sortDirection).find(
            (key) => this.sortDirection[key] !== undefined
          );
          if (column) {
            const valueA = a[column];
            const valueB = b[column];
            return this.sortDirection[column] === 'asc'
              ? valueA < valueB
                ? -1
                : valueA > valueB
                ? 1
                : 0
              : valueB < valueA
              ? -1
              : valueB > valueA
              ? 1
              : 0;
          }
        }
        return 0;
      });
    }

    this.updatePaginator();
  }

  updateSearchResults(results: any[]): void {
    this.searchResults = results;
    this.applyFilters(this.currentFilters);
    this.applySorting();
  }

  applyFilters(filters: any): void {
    let filtered = [...this.searchResults];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(contact =>
        filters.categories.includes(contact.category.mainCategory)
      );
    }

    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(contact => this.isBirthdayInRange(contact.birthday, filters.startDate, filters.endDate));
    }

    this.filteredContacts = filtered;
    this.updatePaginator();
  }

  convertToDate(dateString: string): Date | null {
    return dateString ? new Date(dateString) : null;
  }

  isBirthdayInRange(contactBirthday: string, startDate: string, endDate: string): boolean {
    const start = this.convertToDate(startDate);
    const end = this.convertToDate(endDate);
    const contactDate = new Date(contactBirthday);

    if (start && contactDate < start) {
      return false;
    }

    if (end && contactDate > end) {
      return false;
    }

    return true;
  }

  getPaginatedContacts(): any[] {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredContacts.slice(startIndex, endIndex);
  }

  applyPagination(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  updatePaginator(): void {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

  get noContactsAvailable(): boolean {
    return this.filteredContacts.length === 0;
  }
}
