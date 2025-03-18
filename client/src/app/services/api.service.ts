import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiResponse } from '../interface/event-entry';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3001/api/events/';
  private apiLocalisationUrl = 'http://localhost:3001/api/events/localisation/';
  private apiFiltersUrl = 'http://localhost:3001/api/events/filters';
  private usersUrl = 'http://localhost:3001/api/users';
  eventsUrl = "http://localhost:3001/api/events";

  constructor(private http: HttpClient) {}

  getData(
    page: number,
    restrictDate: boolean,
    minAge: number | null,
    maxAge: number | null,
    ignoreMinAge: boolean,
    ignoreMaxAge: boolean,
    country: string | null
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}${page}`, {
      restrictDate,
      minAge,
      maxAge,
      ignoreMinAge,
      ignoreMaxAge,
      country
    }).pipe(
      tap(response => console.log('Received response from server:', response)),
      catchError(this.handleError)
    );
  }

  getLocalisationData(
    latitude: number,
    longitude: number,
    radius: number,
    page: number,
    restrictDate: boolean,
    minAge: number | null,
    maxAge: number | null,
    ignoreMinAge: boolean,
    ignoreMaxAge: boolean
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiLocalisationUrl}${page}`, {
      latitude,
      longitude,
      radius,
      restrictDate,
      minAge,
      maxAge,
      ignoreMinAge,
      ignoreMaxAge
    }).pipe(
      tap(response => console.log('Received response from localisation API:', response)),
      catchError(this.handleError)
    );
  }

  getFilters(): Observable<any> {
    return this.http.get<any>(this.apiFiltersUrl).pipe(
      tap(response => console.log('Filters received:', response)),
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || 'Unknown error';
    }
    return throwError(errorMessage);
  }

  async getEventByUid(uid: number) {
    const data = await fetch(`${this.eventsUrl}/uid/${uid}`);
    return (await data.json()) || {};
  }

  getUsersExcluding(userId: string): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/exclude/${userId}`).pipe(
      tap(response => console.log('Utilisateurs reçus (exclus l\'utilisateur):', response)),
      catchError(this.handleError)
    );
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/${userId}`).pipe(
      tap(response => console.log('Utilisateur reçu:', response)),
      catchError(this.handleError)
    );
  }
}
