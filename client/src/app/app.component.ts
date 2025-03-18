import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeMainComponent } from './home/home-main/home-main.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthentifiactionService } from './services/authentifiaction.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeMainComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'client';

  constructor(private authService: AuthentifiactionService) {}

}