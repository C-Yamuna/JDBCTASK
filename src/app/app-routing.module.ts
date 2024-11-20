import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address/address.component';

// const routes: Routes = [];
const routes: Routes = [
  { path: 'schemas', component: AddressComponent },
  { path: 'schemas', redirectTo: '/schemas', pathMatch: 'full' } // Optional: Redirect root URL to /states
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
