import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Import AuthService
import { Router } from '@angular/router'; // Import Router for navigation

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
    event.preventDefault(); // Prevent form submission and page reload

    // Call AuthService signup method
    this.authService.signup({ username: this.username, email: this.email, password: this.password }).subscribe(
      (response) => {
        // Log the response to see its structure
        console.log('Signup response:', response);

        if (response && response.username) {
          // Store the username in localStorage after successful signup
          this.authService.setUsername(response.username);

          // Show an alert upon successful signup
          alert('Signup successful! Welcome ' + response.username);

          // Redirect to signin page after successful signup
          this.router.navigate(['/signin']);
        } else {
          // Handle failed signup (e.g., display error message)
          console.error('Signup failed');
          alert('Signup failed. Please try again.');
        }
      },
      (error) => {
        // Handle error (e.g., show an error message)
        console.error('Error during signup:', error);
        alert('Error during signup. Please try again later.');
      }
    );
  }
}
