import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  signin(event: Event) {
    event.preventDefault();
  
    this.authService.signin({ email: this.email, password: this.password }).subscribe(
      (response) => {
        if (response && response.username) {
          this.authService.setUsername(response.username);
          alert('Signin successful! Welcome ' + response.username);
          this.router.navigate(['/home']);
        } else {
          console.error('Signin failed');
          alert('Signin failed. Please check your credentials and try again.');
          this.router.navigate(['/signin']);
        }
      },
      (error) => {
        console.error('Error during signin:', error);
        alert('Error during signin. Please try again later.');
        this.router.navigate(['/signin']);
      }
    );
  }
}
