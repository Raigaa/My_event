import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeBodyComponent } from '../home-body/home-body.component';
import { HomeMenuComponent } from '../home-menu/home-menu.component';

@Component({
  selector: 'app-home-main',
  standalone: true,
  imports: [RouterOutlet, HomeBodyComponent, HomeMenuComponent],
  templateUrl: './home-main.component.html',
  styleUrl: './home-main.component.css',
})
export class HomeMainComponent {

}
