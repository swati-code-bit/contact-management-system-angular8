import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchInput: string = '';
  searchType: string = 'name';
  startDate: string = '';
  endDate: string = '';

  @Output() searchResultsUpdated = new EventEmitter<any[]>();

  constructor(private contactService: ContactService) {}

  ngOnInit() {}

  search(): void {
    if (this.searchType === 'birthday') {
      if (this.startDate && this.endDate) {
        this.contactService.searchContactsByBirthdayRange(this.startDate, this.endDate).subscribe(
          (results) => {
            this.searchResultsUpdated.emit(results);
          },
          (error) => {
            console.error('Error fetching contacts by birthday range:', error);
          }
        );
      } else {
        console.error('Please select both start and end dates.');
      }
    } else {
      this.contactService.searchContactsLike(this.searchInput, this.searchType).subscribe(
        (results) => {
          this.searchResultsUpdated.emit(results);
        },
        (error) => {
          console.error('Error fetching contacts for like-search:', error);
        }
      );
    }
  }

  clearSearch(): void {
    this.searchInput = '';
    this.startDate = '';
    this.endDate = '';
    this.searchType = 'name';
    this.searchResultsUpdated.emit([]);
  }
}
