import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private apiFiltersUrl = 'http://localhost:3001/api/events/filters';
  private locationEnabled: boolean = false;
  private hideEventDone: boolean = true;

  constructor(private http: HttpClient) {}

  isLocationEnabled(): boolean {
    return this.locationEnabled;
  }

  isHideEventDone(): boolean {
    return this.hideEventDone;
  }

  requestLocation(): Promise<{ latitude: number; longitude: number } | null> {
    console.log('Requesting location...');
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        console.log('Geolocation is available');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Position:', position);
            this.locationEnabled = true;
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            this.locationEnabled = false;
            reject(null);
          }
        );
      } else {
        this.locationEnabled = false;
        reject(null);
      }
    });
  }

  getFilters(): Observable<any> {
    return this.http
      .get<any>(this.apiFiltersUrl)
      .pipe(
        tap((response) =>
          console.log('Received filters from server:', response)
        )
      );
  }
}
