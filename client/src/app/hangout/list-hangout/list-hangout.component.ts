import { Component, OnInit, inject } from '@angular/core';
import { HangoutService } from '../../services/hangout.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-hangout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './list-hangout.component.html',
  styleUrls: ['./list-hangout.component.css']
})
export class ListHangoutComponent implements OnInit {

  hangouts: any[] = []; // Liste de hangouts

  constructor(private hangoutService: HangoutService) {}

  ngOnInit(): void {
    this.hangoutService.getAllHangouts().subscribe(
      (response) => {
        this.hangouts = response;
        console.log('Liste des hangouts récupérée avec succès:', response);
      },
      (error) => {
        console.error('Erreur lors de la récupération des hangouts:', error);
      }
    );
  }
}
