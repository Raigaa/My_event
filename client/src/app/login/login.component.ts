import { Component, OnInit, AfterViewInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthentifiactionService } from '../services/authentifiaction.service';
import { User } from '../interface/user';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit, OnInit {
  userProfile: User | null = null;

  constructor(
    private renderer: Renderer2,
    private authService: AuthentifiactionService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngAfterViewInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeGoogleSignIn();
    this.renderer.appendChild(document.body, script);
  }

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: environment.googleToken,
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-button'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any) {
    this.verifyToken(response.credential);
  }

  verifyToken(token: string): void {
    this.authService.loginWithGoogle(token)
      .subscribe({
        next: (res) => {
          console.log('User récupéré depuis le serveur: ', res);
        },
        error: (err) => {
          console.error('Erreur lors de la vérificatin du token: ', err);
        }
      })
  }

  ngOnInit(): void {
    console.log('USERPROFIL 1 ', this.userProfile);
    this.authService.getUserProfile().subscribe({
      next: (user: User) => {
        this.userProfile = user;
        this.cdRef.detectChanges();
        console.log("Profil de l'utilisateur connecté: ", this.userProfile);
      },
      error: (err: any) => {
        console.error("Erreur lors de la récupération du profil: ", err);
      }
    });
    
    this.authService.user$.subscribe({
      next: (user: User) => {
        this.userProfile = user;
        this.cdRef.detectChanges();
        console.log("Profil de l'utilisateur connecté: ", this.userProfile);
      },
      error: (err: any) => {
        console.log(this.userProfile)
        console.error("Erreur lors de la récupération du profil: ", err);
      }
    });
  }

  getSession(): void {
    this.authService.getUserProfile().subscribe({
      next: (res) => {
        this.userProfile = res;
        console.log('Profil récupéré dans la session : ', this.userProfile);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur session', err);
      }
    })
  }

  logout(): void {
    this.authService.disconnect().subscribe({
      next: () => {
        this.userProfile = null;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log('Erreur lors de la déconnexion : ', err);
      }
    })
  }
}
