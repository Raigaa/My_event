import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  imports: [CommonModule]
})
export class SpinnerComponent {
  @Input() isLoading: boolean = false;
}
