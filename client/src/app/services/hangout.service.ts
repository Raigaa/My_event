import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HangoutService {
  private hangoutUrl = 'http://localhost:3001/api/hangout';
  private getHangoutUrl = 'http://localhost:3001/api/hangouts';

  constructor(private http: HttpClient) { }

  newHangout(
    owner: string,
    visibility: string,
    participants: Array<string>,
    eventUid: number
  ): Observable<any> {
    const hangoutData = {
      owner, // Assurez-vous que `owner` est correctement défini
      visibility,
      participants,
      eventUid
    };
  
    console.log('Données envoyées dans la requête POST:', hangoutData); // Ajouter un log pour déboguer
  
    return this.http.post<any>(this.hangoutUrl, hangoutData).pipe(
      tap(response => {
        console.log('Hangout créé avec succès:', response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAllHangouts(): Observable<any> {
    return this.http.get<any>(this.getHangoutUrl).pipe(
      tap(response => {
        console.log('Liste des hangouts récupérée avec succès:', response);
      }),
      catchError(this.handleError)
    );
  }

  getHangoutById(id: string): Observable<any> {
    return this.http.get<any>(`${this.getHangoutUrl}/event/${id}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des détails du hangout:', error);
        return throwError(() => new Error('Erreur lors de la récupération des détails du hangout'));
      })
    );
  }
  
  joinHangout(hangoutId: string, userId: string): Observable<any> {
    return this.http.post<any>(`http://localhost:3001/api/hangouts/${hangoutId}/add-participant`, { userId });  }
}
