import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; // Import BehaviorSubject

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // API endpoint
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated()); // Track authentication state
  private usernameSubject = new BehaviorSubject<string>(this.getUsername() || ''); // Track username

  constructor(private http: HttpClient) {}

  // API call to register the user
  signup(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  // API call to sign in the user
  signin(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Ensure content type is set to JSON
    });
  
    console.log('Sending credentials:', credentials);  // Log the credentials being sent
  
    return this.http.post(`${this.apiUrl}/signin`, credentials, { headers });
  }

  // Log the user out by clearing localStorage
  logout(): void {
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false); // Update the auth status
    this.usernameSubject.next(''); // Reset username
  }

  // Check if the user is authenticated by checking localStorage
  isAuthenticated(): boolean {
    return !!localStorage.getItem('username');
  }

  // Get the username from localStorage
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
    this.isAuthenticatedSubject.next(true); // Update the auth status
    this.usernameSubject.next(username); // Update the username
  }

  getAuthenticationStatus() {
    return this.isAuthenticatedSubject.asObservable();
  }

  getUsernameStatus() {
    return this.usernameSubject.asObservable();
  }
}
