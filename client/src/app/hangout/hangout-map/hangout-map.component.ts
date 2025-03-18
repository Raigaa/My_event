import { Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-hangout-map',
  standalone: true,
  templateUrl: './hangout-map.component.html',
  styleUrls: ['./hangout-map.component.css']
})
export class HangoutMapComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer') mapContainer: ElementRef | undefined;
  @Input() latitude: number | undefined;
  @Input() longitude: number | undefined;
  private map: any;

  ngOnInit(): void {
    // Fournir des coordonnées par défaut si aucune n'est passée
    if (this.latitude === undefined) {
      this.latitude = 48.8566;
    }
    if (this.longitude === undefined) {
      this.longitude = 2.3522; // Longitude par défaut (ex : Paris)
    }
  }

  ngAfterViewInit(): void {
    this.loadMap();
  }

  loadMap(): void {
    if (this.mapContainer) {
      this.map = L.map(this.mapContainer.nativeElement).setView([this.latitude!, this.longitude!], 15);

      // Ajouter la couche de carte
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Ajouter un marker à la carte
      if (this.latitude !== undefined && this.longitude !== undefined) {
        L.marker([this.latitude, this.longitude]).addTo(this.map)
          .bindPopup('Lieu: Événement')
          .openPopup();
      }
    }
  }
}
