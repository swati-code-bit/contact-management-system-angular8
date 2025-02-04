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
  isLoggedIn: boolean = false;
  username: string = '';
  isSignInForm: boolean = true;
  isRegisterForm: boolean = false;
  authSubscription: Subscription;
  usernameSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService
      .getAuthenticationStatus()
      .subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.usernameSubscription = this.authService
      .getUsernameStatus()
      .subscribe((username) => {
        this.username = username;
      });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.usernameSubscription) this.usernameSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/signin']);
  }

  navigateToSignIn(): void {
    this.isSignInForm = true;
    this.isRegisterForm = false;
    this.router.navigate(['/signin']);
  }

  navigateToRegister(): void {
    this.isSignInForm = false;
    this.isRegisterForm = true;
    this.router.navigate(['/register']);
  }

  navigateToConfig(): void {
    this.router.navigate(['/config']);
  }
}
