import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ConfigComponent } from './config/config.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'register', component: SignupComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'edit-contact/:id', component: EditContactComponent },
  { path: 'add-contact', component: AddContactComponent },
  { path: '**', redirectTo: '/signin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
