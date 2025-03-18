import { Routes } from '@angular/router';
import { HomeBodyComponent } from './home/home-body/home-body.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { LoginComponent } from './login/login.component';
import { ListHangoutComponent } from './hangout/list-hangout/list-hangout.component';
import { HangoutOrganizeComponent } from './hangout/hangout-organize/hangout-organize.component';

export const routes: Routes = [
    { path: 'home', component: HomeBodyComponent },
    { path: '' , redirectTo: '/home', pathMatch: 'full' },
    { path: 'event/:uid', component: EventDetailComponent },
    { path: 'auth', component: LoginComponent },
    { path: 'hangouts', component: ListHangoutComponent },
    { path: 'organize/:uid', component: HangoutOrganizeComponent }
];
