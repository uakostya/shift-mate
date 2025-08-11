import { Routes } from '@angular/router';
import { ScheduleSetupComponent } from './components/schedule-setup.component';
import { ScheduleViewComponent } from './components/schedule-view.component';

export const routes: Routes = [
  { path: '', component: ScheduleSetupComponent },
  { path: 'schedule', component: ScheduleViewComponent },
  { path: '**', redirectTo: '' },
];
