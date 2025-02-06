import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

interface Contact {
  contactid: number;
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
}

@Injectable({
  providedIn: "root",
})
export class ContactService {
  private apiUrl = "http://localhost:5000/api/contacts";
  private contactsUpdated = new Subject<void>();
  contactsUpdated$ = this.contactsUpdated.asObservable();
  private filterUpdated = new Subject<any>();
  filterUpdated$ = this.filterUpdated.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set("Content-Type", "application/json");
  }

  private handleError(error: any): Observable<never> {
    console.error("API Error:", error);
    throw error;
  }

  getContactById(contactId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${contactId}`);
  }

  getContacts(): Observable<Contact[]> {
    return this.http
      .get<Contact[]>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http
      .post<Contact>(`${this.apiUrl}`, contact, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  createDynamicContact(contact: Contact): Observable<Contact> {
    console.log('incontact ctrller');
    return this.http
      .post<Contact>(`${this.apiUrl}/add-dynamic-contact`, contact, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateContact(contactId: string, contactData: any): Observable<any> {
    console.log("Sending contactData to backend:", contactData);
    return this.http
      .put<any>(`${this.apiUrl}/${contactId}`, contactData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteContact(contactId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${contactId}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  notifyContactsUpdated(): void {
    this.contactsUpdated.next();
  }

  searchContactsLike(
    searchInput: string,
    searchType: string
  ): Observable<Contact[]> {
    const body = { searchType, searchInput };
    return this.http
      .post<Contact[]>(`${this.apiUrl}/search`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  searchContactsByBirthdayRange(
    startDate: string,
    endDate: string
  ): Observable<Contact[]> {
    const body = {
      searchType: "birthday",
      searchInput: `${startDate} to ${endDate}`,
    };
    return this.http
      .post<Contact[]>(`${this.apiUrl}/search`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  searchContactsByFilters(filters: any): Observable<Contact[]> {
    return this.http
      .post<Contact[]>(`${this.apiUrl}/search-by-filters`, filters, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateFilters(filters: any): void {
    this.filterUpdated.next(filters);
  }

  getTotalContactsCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrl}/count`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
