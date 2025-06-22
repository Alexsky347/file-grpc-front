import { Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';

export const routes: Routes = [
  { path: '', component: GalleryComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'gallery/:username', component: GalleryComponent },
  { path: '**', redirectTo: '' }
];
