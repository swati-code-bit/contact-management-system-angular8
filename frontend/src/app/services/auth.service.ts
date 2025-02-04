import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  private usernameSubject = new BehaviorSubject<string>(this.getUsername() || '');

  constructor(private http: HttpClient) {}

  signup(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  signin(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.apiUrl}/signin`, credentials, { headers });
  }

  logout(): void {
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
    this.usernameSubject.next('');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('username');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
    this.isAuthenticatedSubject.next(true);
    this.usernameSubject.next(username);
  }

  getAuthenticationStatus() {
    return this.isAuthenticatedSubject.asObservable();
  }

  getUsernameStatus() {
    return this.usernameSubject.asObservable();
  }
}
