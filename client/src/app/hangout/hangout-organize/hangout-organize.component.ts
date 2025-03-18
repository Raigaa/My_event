import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HangoutService } from '../../services/hangout.service';
import { HangoutMapComponent } from '../hangout-map/hangout-map.component';
import { AuthentifiactionService } from '../../services/authentifiaction.service';

@Component({
  selector: 'app-hangout-organize',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, HangoutMapComponent],
  templateUrl: './hangout-organize.component.html',
  styleUrls: ['./hangout-organize.component.css'],
})
export class HangoutOrganizeComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthentifiactionService = inject(AuthentifiactionService);
  hangoutService: HangoutService = inject(HangoutService);
  api: ApiService = inject(ApiService);
  hangout: any;
  owner: any;
  currentUserId: string = '';
  currentUser: any;

  ngOnInit() {
      this.currentUser = this.authService.getCurrentUser();
      if(this.currentUser){
        this.currentUserId = this.currentUser._id;
        // console.log('Current user ID:', this.currentUserId);
        const hangoutUid = String(this.route.snapshot.params['uid']);
        this.loadHangout(hangoutUid);
      
      } else {
        // console.log('No user found, fetching user profile');
        this.authService.getUserProfile().subscribe(user => {
          // console.log('User fetched:', user);
          this.currentUser = user;
          this.currentUserId = this.currentUser.id;
          // console.log('Current user ID:', this.currentUserId);
          const hangoutUid = String(this.route.snapshot.params['uid']);
          this.loadHangout(hangoutUid);
        }, error => {
          console.error('Error fetching user profile:', error);
        });
      }
  }

  private loadHangout(hangoutUid: string) {
    this.hangoutService.getHangoutById(hangoutUid).subscribe(
      result => {
        // console.log('Détails du hangout:', result);
        this.hangout = result;
        if (result?.owner) {
          this.getUser(result.owner);
        }
      },
      error => console.error('Erreur lors de la récupération des détails du hangout:', error)
    );
  }

  private getUser(userId: string) {
    this.api.getUserById(userId).subscribe(
      result => {
        // console.log('Détails de l\'utilisateur:', result);
        this.owner = result;
      },
      error => console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error)
    );
  }

  async joinHangout() {
    if (!this.hangout?._id) {
      console.error("Le hangout est manquant");
      return;
    }

    if (!this.currentUserId) {
      console.error("L'ID de l'utilisateur est manquant");
      return;
    }

    try {
      // console.log("Tentative de rejoindre le hangout avec l'ID:", this.hangout._id);
      // console.log("ID de l'utilisateur actuel:", this.currentUserId);

      this.hangoutService.joinHangout(this.hangout._id, this.currentUserId).subscribe(
        response => {
          // console.log('Réponse de la jonction au hangout:', response);
          if (response?.message) {
            alert(response.message);
            window.location.reload();
          } else {
            alert('Participant ajouté avec succès');
          }
        },
        error => {
          const errorMessage = error.error?.message || 'Une erreur est survenue';
          alert(errorMessage);
          console.error('Erreur lors de la jonction:', error);
        }
      );
    } catch (error) {
      console.error('Erreur lors de la jonction:', error);
    }
  }
}
