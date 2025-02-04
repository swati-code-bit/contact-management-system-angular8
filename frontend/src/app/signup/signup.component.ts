import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  signup(event: Event) {
    event.preventDefault();

    this.authService.signup({ username: this.username, email: this.email, password: this.password }).subscribe(
      (response) => {
        if (response && response.username) {
          this.authService.setUsername(response.username);
          alert('Signup successful! Welcome ' + response.username);
          this.router.navigate(['/signin']);
        } else {
          console.error('Signup failed');
          alert('Signup failed. Please try again.');
        }
      },
      (error) => {
        console.error('Error during signup:', error);
        alert('Error during signup. Please try again later.');
      }
    );
  }
}
