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
  sortDirection: { [key: string]: 'asc' | 'desc' | undefined } = {}; // track sort direction per column
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
        this.applyFilters(this.currentFilters); // Reapply filters when they are updated
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
        this.applyFilters(this.currentFilters); // Apply filters when data is fetched
        this.applySorting();  // Reapply sorting after fetching data
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
          // Update local data after deletion
          this.contacts = this.contacts.filter(
            (contact) => contact._id !== contactId
          );
          this.searchResults = this.searchResults.filter(
            (contact) => contact._id !== contactId
          );

          // Reapply sorting and filters after deletion
          this.applyFilters(this.currentFilters);
          this.applySorting();  // Ensure sorting is reapplied
        },
        (error) => {
          console.error('Error deleting contact:', error);
        }
      );
    }
  }

  editContact(contactId: string): void {
    this.fetchContacts(); // Re-fetch contacts after edit
    this.applySorting();
    this.applyFilters(this.currentFilters); // Ensure filters are reapplied after editing
  }

  sortContacts(column: string, event: Event): void {
    event.preventDefault();
    const currentDirection = this.sortDirection[column];

    // Clear the sorting state for all other columns
    Object.keys(this.sortDirection).forEach((key) => {
      if (key !== column) {
        this.sortDirection[key] = undefined;
      }
    });

    // Toggle sorting direction (ascending, descending, or undefined)
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
      this.filteredContacts = [...this.searchResults]; // Reset to default order
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
    this.applyFilters(this.currentFilters); // Apply filters when search results change
    this.applySorting();
  }

  applyFilters(filters: any): void {
    let filtered = [...this.searchResults];

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(contact =>
        filters.categories.includes(contact.category.mainCategory)
      );
    }

    // Apply birthday range filters
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

    // Check if start date is set and contact date is earlier than start
    if (start && contactDate < start) {
      return false;
    }

    // Check if end date is set and contact date is later than end
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
      this.paginator.pageIndex = 0; // Reset to the first page when applying filters
    }
  }

  get noContactsAvailable(): boolean {
    return this.filteredContacts.length === 0;
  }
}
