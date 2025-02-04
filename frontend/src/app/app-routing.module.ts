import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ConfigComponent } from './config/config.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },          // Route for sign-in
  { path: 'register', component: SignupComponent },        // Route for register
  {path:'config',component:ConfigComponent}   ,
  { path: 'home', component: HomeComponent },              // Route for home
  { path: '', redirectTo: '/signin', pathMatch: 'full' },  // Redirect root to '/signin'
  { path: 'edit-contact/:id', component: EditContactComponent }, // Route for editing contact
  { path: 'add-contact', component: AddContactComponent }, // Route for adding contact
  { path: '**', redirectTo: '/signin' } 
                 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
