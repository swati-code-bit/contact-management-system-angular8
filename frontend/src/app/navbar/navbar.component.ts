import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false; // To track if the user is logged in
  username: string = ''; // To store username after login
  isSignInForm: boolean = true; // Default: Show Sign In button (thus, show Register Form)
  isRegisterForm: boolean = false; // Initially show Register button
  authSubscription: Subscription;
  usernameSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to authentication status changes
    this.authSubscription = this.authService
      .getAuthenticationStatus()
      .subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      });

    // Subscribe to username changes
    this.usernameSubscription = this.authService
      .getUsernameStatus()
      .subscribe((username) => {
        this.username = username;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe when the component is destroyed to avoid memory leaks
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.usernameSubscription) this.usernameSubscription.unsubscribe();
  }

  // Log out the user
  logout(): void {
    this.authService.logout(); // Call the logout function in AuthService
    this.isLoggedIn = false; // Set logged in state to false
    this.router.navigate(['/signin']); // Navigate to sign-in page
  }

  // Navigate to Sign In page and show Sign In form
  navigateToSignIn(): void {
    this.isSignInForm = true; // Show Sign In form
    this.isRegisterForm = false; // Hide Register form
    this.router.navigate(['/signin']); // Navigate to Sign In page
  }

  // Navigate to Register page and show Register form
  navigateToRegister(): void {
    this.isSignInForm = false; // Hide Sign In form
    this.isRegisterForm = true; // Show Register form
    this.router.navigate(['/register']); // Navigate to Register page
  }

  // Navigate to Config page
  navigateToConfig(): void {
    this.router.navigate(['/config']); // Navigate to Config component
  }
}
