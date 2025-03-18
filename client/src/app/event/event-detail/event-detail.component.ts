import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { EventEntry } from '../../interface/event-entry';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EventHangoutModaleComponent } from '../event-hangout-modale/event-hangout-modale.component';
import { CommonModule } from '@angular/common';
import { HangoutService } from '../../services/hangout.service';
import { AuthentifiactionService } from '../../services/authentifiaction.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    FontAwesomeModule,
    RouterLink,
    RouterOutlet,
    EventHangoutModaleComponent,
    CommonModule,
  ],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  apiService: ApiService = inject(ApiService);
  hangoutService: HangoutService = inject(HangoutService);
  authService: AuthentifiactionService = inject(AuthentifiactionService);
  
  event: EventEntry | undefined;
  showModal: boolean = false;
  faCalendar = faCalendar;
  faLocationDot = faLocationDot;
  users: any[] = [];
  userId: string | null = null;
  currentUser: any;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  
    if (this.currentUser) {
      this.userId = this.currentUser._id;
      this.loadUsersExcluding();
    } else {
      console.log('No user found, fetching user profile');
      this.authService.getUserProfile().subscribe(user => {
        console.log('User fetched:', user);
        this.currentUser = user;
        this.userId = this.currentUser.id;
        this.loadUsersExcluding();
      }, error => {
        console.error('Error fetching user profile:', error);
      });
    }
  
    const eventUid = Number(this.route.snapshot.params['uid']);
    this.loadEvent(eventUid);
  }
  

  openModal() {
    if (this.currentUser) {
      console.log(this.currentUser)
      this.showModal = true;
    } else {
      console.error('Impossible d\'ouvrir la modale, l\'utilisateur actuel est introuvable.');
    }
  }
  

  closeModal() {
    this.showModal = false;
  }

  async loadEvent(eventUid: number) {
    try {
      this.event = await this.apiService.getEventByUid(eventUid);
      // console.log(this.event);
    } catch (error) {
      console.log('Error loading event:', error);
    }
  }

  loadUsersExcluding() {
    if (this.currentUser && this.currentUser._id) {
      this.apiService.getUsersExcluding(this.currentUser._id).subscribe(
        (result) => {
          console.log('Utilisateurs reçus:', result);
          this.users = result;
        },
        (error) => {
          console.error('Erreur lors du chargement des utilisateurs:', error);
        }
      );
    } else {
      console.error('Impossible de charger les utilisateurs, l\'ID de l\'utilisateur actuel est introuvable.');
    }
  }

  handleModaleValidation(data: { visibility: string, selectedUsers: any[] }) {
    const eventUid = Number(this.route.snapshot.params['uid']);
    console.log('Données reçues de la modale:', data);
  
    console.log(this.currentUser);
    const owner = this.currentUser ? this.currentUser.id : null;
    console.log(owner);
  
    this.hangoutService.newHangout(owner, data.visibility, data.selectedUsers.map(user => user._id), eventUid).subscribe(
      (result) => {
        console.log('Hangout créé avec succès:', result);
      },
      (error) => {
        console.error('Erreur lors de la création du hangout:', error);
      }
    );
  }
  
  
}
