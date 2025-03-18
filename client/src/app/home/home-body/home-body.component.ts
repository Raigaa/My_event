import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { ApiResponse } from '../../interface/event-entry';
import { HomeMenuComponent } from '../home-menu/home-menu.component';
import { FiltersService } from '../../services/filters.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-home-body',
  standalone: true,
  imports: [
    CommonModule,
    JsonPipe,
    KeyValuePipe,
    HomeMenuComponent,
    RouterLink,
    RouterOutlet,
    SpinnerComponent,
  ],
  templateUrl: './home-body.component.html',
  styleUrls: ['./home-body.component.css'],
})
export class HomeBodyComponent implements OnInit {
  @Output() locationDenied = new EventEmitter<void>();

  private dataSubject = new BehaviorSubject<ApiResponse | null>(null);
  data$: Observable<ApiResponse | null> = this.dataSubject.asObservable();
  private errorSubject = new Subject<string>();
  error$: Observable<string> = this.errorSubject.asObservable();
  private latitude: number | null = null;
  private longitude: number | null = null;
  private restrictDate: boolean;
  page: number = 1;
  totalPages: number = 1;
  radius: number = 20;
  ageRangeMin: number = 1;
  ageRangeMax: number = 121;
  ignoreMinAge: boolean = true;
  ignoreMaxAge: boolean = true;
  selectedCountry: string | null = null;
  isLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private filtersservice: FiltersService,
  ) {
    this.restrictDate = this.filtersservice.isHideEventDone();
  }

  ngOnInit(): void {
    this.loadDefaultData(this.page, this.restrictDate);
  }

  onHideEventDoneChange(hideEventDone: boolean): void {
    this.restrictDate = hideEventDone;
    this.page = 1;
    this.loadData();
  }

  loadDefaultData(page: number, restrictDate: boolean): void {
    console.log("Appel de l'API avec les paramètres :", {
      page,
      restrictDate,
      ageRangeMin: this.ageRangeMin,
      ageRangeMax: this.ageRangeMax,
      ignoreMinAge: this.ignoreMinAge,
      ignoreMaxAge: this.ignoreMaxAge,
      selectedCountry: this.selectedCountry,
    });

    this.apiService
      .getData(
        page,
        restrictDate,
        this.ageRangeMin,
        this.ageRangeMax,
        this.ignoreMinAge,
        this.ignoreMaxAge,
        this.selectedCountry
      )
      .subscribe({
        next: (data) => {
          this.dataSubject.next(data);
          this.totalPages = data.totalPages;
          this.errorSubject.next('');
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.dataSubject.next(null);
          this.errorSubject.next(error);
        },
      });
  }

  loadLocationData(): void {
    if (this.latitude !== null && this.longitude !== null) {
      this.apiService
        .getLocalisationData(
          this.latitude,
          this.longitude,
          this.radius,
          this.page,
          this.restrictDate,
          this.ageRangeMin,
          this.ageRangeMax,
          this.ignoreMinAge,
          this.ignoreMaxAge
        )
        .subscribe({
          next: (data) => {
            this.dataSubject.next(data);
            this.totalPages = data.totalPages;
            this.errorSubject.next('');
          },
          error: (error) => {
            console.error('Error loading location data:', error);
            this.dataSubject.next(null);
            this.errorSubject.next(error);
          },
        });
    }
  }

  requestLocation(): void {
    this.isLoading = true; 
    this.filtersservice.requestLocation().then(
      (position) => {
        if (position) {
          this.latitude = position.latitude;
          this.longitude = position.longitude;
          this.page = 1;
          this.loadLocationData();
        } else {
          this.loadDefaultData(this.page, this.restrictDate);
          this.locationDenied.emit();
        }
        this.isLoading = false; // Cacher le loader après la requête
      },
      () => {
        this.loadDefaultData(this.page, this.restrictDate);
        this.locationDenied.emit();
        this.isLoading = false;
      }
    );
  }

  onRadiusChange(newRadius: number): void {
    this.radius = newRadius;
    this.page = 1;
    this.loadLocationData();
  }

  onRequestLocation(requestLocation: boolean): void {
    if (requestLocation) {
      this.requestLocation();
    } else {
      this.page = 1;
      this.loadDefaultData(this.page, this.restrictDate);
    }
  }

  onAgeRangeMinChange(newMinAge: number): void {
    this.ageRangeMin = newMinAge;
    this.page = 1;
    console.log('Âge minimum reçu :', this.ageRangeMin);
    this.loadData(); // Charge les données en tenant compte des nouvelles valeurs
  }

  onAgeRangeMaxChange(newMaxAge: number): void {
    this.ageRangeMax = newMaxAge;
    this.page = 1;
    console.log('Âge maximum reçu :', this.ageRangeMax);
    this.loadData(); // Charge les données en tenant compte des nouvelles valeurs
  }

  onIgnoreMinAgeChange(ignore: boolean): void {
    this.ignoreMinAge = ignore;
    this.page = 1;
    console.log("Ignorer l'âge minimum :", this.ignoreMinAge);
    this.loadData(); // Recharge les données en tenant compte des nouvelles options
  }

  onIgnoreMaxAgeChange(ignore: boolean): void {
    this.ignoreMaxAge = ignore;
    this.page = 1;
    console.log("Ignorer l'âge maximum :", this.ignoreMaxAge);
    this.loadData();
  }

  private loadData(): void {
    console.log('Chargement des données avec les paramètres :', {
      latitude: this.latitude,
      longitude: this.longitude,
      page: this.page,
      restrictDate: this.restrictDate,
      ageRangeMin: this.ageRangeMin,
      ageRangeMax: this.ageRangeMax,
      ignoreMinAge: this.ignoreMinAge,
      ignoreMaxAge: this.ignoreMaxAge,
      selectedCountry: this.selectedCountry,
    });

    if (this.latitude !== null && this.longitude !== null) {
      this.loadLocationData();
    } else {
      this.loadDefaultData(this.page, this.restrictDate);
    }
  }

  onCountryChange(newCountry: string): void {
    this.selectedCountry = newCountry;
    this.page = 1;
    console.log('Pays sélectionné :', this.selectedCountry);
    this.loadData();
  }

  goToNextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadData();
      this.scrollToTop();
    }
  }

  goToPreviousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadData();
      this.scrollToTop();
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
