import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-event-hangout-modale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-hangout-modale.component.html',
  styleUrls: ['./event-hangout-modale.component.css']
})
export class EventHangoutModaleComponent implements OnInit {
  @Input() title_fr: string | undefined;
  @Input() daterange_fr: string | undefined;
  @Input() location_address: string | undefined;
  @Input() userId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() validate = new EventEmitter<{ visibility: string, selectedUsers: any[] }>();

  visibility: string = 'public';
  selectedUser: string = '';
  selectedUsers: any[] = [];
  users: any[] = []; // Liste des utilisateurs disponibles

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    if (this.userId) {
      this.loadUsersExcluding();
    } else {
      console.error('L\'ID de l\'utilisateur n\'est pas défini.');
    }
  }

  closeModale() {
    this.close.emit();
  }

  validateModale() {
    // console.log('Modale validée');
    // console.log(this.userId);
    // console.log('Visibilité:', this.visibility);
    // console.log('Utilisateurs sélectionnés:', this.selectedUsers);
    this.validate.emit({ visibility: this.visibility, selectedUsers: this.selectedUsers });
    this.closeModale();
  }

  onUserSelect() {
    if (this.selectedUser) {
      const user = this.filteredUsers.find(u => u._id === this.selectedUser);
      if (user && !this.selectedUsers.some(u => u._id === user._id)) {
        this.selectedUsers.push(user);
      }
      this.selectedUser = '';
    }
  }

  removeUser(userId: string) {
    this.selectedUsers = this.selectedUsers.filter(user => user._id !== userId);
  }

  get filteredUsers() {
    return this.users.filter(user => !this.selectedUsers.some(selectedUser => selectedUser._id === user._id));
  }

  private loadUsersExcluding() {
    if (this.userId) {
      this.apiService.getUsersExcluding(this.userId).subscribe(
        (result) => {
          console.log('Utilisateurs reçus:', result);
          this.users = result;
        },
        (error) => {
          console.error('Erreur lors du chargement des utilisateurs:', error);
        }
      );
    }
  }
}
