import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthResponse, User } from '../interface/user';


@Injectable({
  providedIn: 'root'
})
export class AuthentifiactionService {
  private apiUrl = "http://localhost:3001/api/auth";
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  loginWithGoogle(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, { token }, { withCredentials: true }).pipe(
      tap((res) => {
        this.userSubject.next(res.user);
      })
    )
  }

  getUserProfile(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/user/profile`, { withCredentials: true }).pipe(
      map(response => response.user)
    )
  }

  disconnect(): Observable<any> {
    return this.http.post(`${this.apiUrl}/disconnect`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.userSubject.next(null);
      })
    );
  }

  getCurrentUser(): any {
    return this.userSubject.value;
  }
}
