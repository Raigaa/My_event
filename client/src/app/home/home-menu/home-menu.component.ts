import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersService } from '../../services/filters.service';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [CommonModule, NgxSliderModule],
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.css'],
})
export class HomeMenuComponent implements OnInit {
  radius: number = 20;
  isLocationEnabled: boolean = false;
  hideEventDone: boolean = true;
  isAgeRangedEnabled: boolean = false;
  ageRangeMin: number = 1;
  ageRangeMax: number = 121;
  ignoreMinAge: boolean = true;
  ignoreMaxAge: boolean = true;
  countries: string[] = [];
  selectedCountry: string = '';

  ageSliderOptions: Options = {
    floor: 18,
    ceil: 100,
    step: 1,
    translate: (value: number): string => `${value} ans`,
  };

  @Output() radiusChange = new EventEmitter<number>();
  @Output() requestLocation = new EventEmitter<boolean>();
  @Output() hideEventDoneChange = new EventEmitter<boolean>();
  @Output() ageRangeMinChange = new EventEmitter<number>();
  @Output() ageRangeMaxChange = new EventEmitter<number>();
  @Output() ignoreMinAgeChange = new EventEmitter<boolean>();
  @Output() ignoreMaxAgeChange = new EventEmitter<boolean>();
  @Input() locationDenied!: EventEmitter<void>;
  @Output() countryChange = new EventEmitter<string>();

  constructor(private filtersservice: FiltersService) {}

  ngOnInit(): void {
    this.isLocationEnabled = this.filtersservice.isLocationEnabled();
    this.hideEventDone = this.filtersservice.isHideEventDone();
    this.locationDenied.subscribe(() => this.onLocationDenied());
    this.filtersservice.getFilters().subscribe((response) => {
      this.countries = response.countries;
      this.ageRangeMin = response.minAge;
      this.ageRangeMax = response.maxAge;
      this.ageSliderOptions = {
        ...this.ageSliderOptions,
        floor: response.minAge,
        ceil: response.maxAge,
      };
    });
  }

  onRadiusChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.radius = +target.value;
    console.log('Rayon sélectionné :', this.radius);
    this.radiusChange.emit(this.radius);
  }

  onLocationCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.isLocationEnabled = target.checked;
    console.log('Utiliser la localisation :', this.isLocationEnabled);
    this.requestLocation.emit(this.isLocationEnabled);
  }

  onLocationDenied(): void {
    this.isLocationEnabled = false;
  }

  onHideEventDoneChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.hideEventDone = target.checked;
    console.log('Masquer les événements terminés :', this.hideEventDone);
    this.hideEventDoneChange.emit(this.hideEventDone);
  }

  onAgeRangedCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.isAgeRangedEnabled = target.checked;
    console.log("Activer la plage d'âge :", this.isAgeRangedEnabled);
  }

  onAgeRangeMinChange(newValue: number): void {
    if (!this.ignoreMinAge) {
      this.ageRangeMin = newValue;
      if (this.ageRangeMin > this.ageRangeMax) {
        this.ageRangeMax = this.ageRangeMin;
      }
      this.ageRangeMinChange.emit(this.ageRangeMin);
    }
    console.log('Âge minimum sélectionné :', this.ageRangeMin);
  }

  onAgeRangeMaxChange(newValue: number): void {
    if (!this.ignoreMaxAge) {
      this.ageRangeMax = newValue;
      if (this.ageRangeMax < this.ageRangeMin) {
        this.ageRangeMin = this.ageRangeMax;
      }
      this.ageRangeMaxChange.emit(this.ageRangeMax);
    }
    console.log('Âge maximum sélectionné :', this.ageRangeMax);
  }

  onIgnoreMinAgeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.ignoreMinAge = target.checked;
    this.ignoreMinAgeChange.emit(this.ignoreMinAge);
  }

  onIgnoreMaxAgeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.ignoreMaxAge = target.checked;
    this.ignoreMaxAgeChange.emit(this.ignoreMaxAge);
  }

  onCountryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCountry = selectElement.value;
    this.countryChange.emit(selectedCountry);
  }
}