import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FileService } from '../../services/file.service';
import { FileInfo } from '../../models/file.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { formatDate, formatFileSize } from '../../utils/format.utils';
import { ActivatedRoute } from '@angular/router';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <div class="gallery-container">
      <h1>User Gallery</h1>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (error()) {
        <div class="error-container">
          <p>{{ error() }}</p>
          <button mat-raised-button color="primary" (click)="loadUserImages('testUser')">
            Try Again
          </button>
        </div>
      } @else if (files().length === 0) {
        <div class="empty-container">
          <p>No images found for this user</p>
        </div>
      } @else {
        <mat-grid-list [cols]="breakpoint()" rowHeight="1:1" (window:resize)="onResize($event)">
          @for (file of files(); track file.objectName) {
            <mat-grid-tile>
              <mat-card class="image-card" (click)="openImageViewer(file)">
                <img mat-card-image [src]="file.fileUrl" [alt]="file.filename" (error)="handleImageError($event)">
                <mat-card-content>
                  <p>{{ file.filename }}</p>
                  <p class="file-info">{{ formatFileSize(file.size) }} · {{ formatDate(file.lastModified) }}</p>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>
          }
        </mat-grid-list>
      }
    </div>
  `,
  styles: [`
    .gallery-container {
      padding: 20px;
    }

    h1 {
      margin-bottom: 24px;
      color: #333;
    }

    .loading-container, .error-container, .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
    }

    .error-container p {
      color: #f44336;
      margin-bottom: 16px;
    }

    .image-card {
      margin: 8px;
      max-width: 100%;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .image-card:hover {
      transform: scale(1.02);
    }

    .image-card img {
      height: 200px;
      object-fit: cover;
    }

    mat-card-content p {
      margin: 8px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-info {
      font-size: 12px;
      color: #777;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent {
  private readonly fileService = inject(FileService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);

  files = signal<FileInfo[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Responsive grid
  breakpoint = signal<number>(4);

  constructor() {
    this.setBreakpoint(window.innerWidth);
    this.loadUserImages('testUser');

    // Subscribe to route params to handle refresh events
    this.route.params.subscribe(params => {
      if (params['refresh']) {
        this.loadUserImages('testUser');
      }
    });
  }

  onResize(event: Event) {
    this.setBreakpoint((event.target as Window).innerWidth);
  }

  setBreakpoint(width: number) {
    let cols = 4;
    if (width <= 600) {
      cols = 1;
    } else if (width <= 960) {
      cols = 2;
    } else if (width <= 1280) {
      cols = 3;
    }
    this.breakpoint.set(cols);
  }
  loadUserImages(username: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.fileService.getUserFiles(username).subscribe({
      next: (data) => {
        this.files.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching images:', err);
        this.error.set('Failed to load images. Please try again later.');
        this.loading.set(false);
        this.snackBar.open('Error loading images', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  // Use the imported utility functions
  formatFileSize = formatFileSize;
  formatDate = formatDate;

  // Add error handling for images
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/placeholder-image.png'; // Fallback image
  }

  openImageViewer(file: FileInfo) {
    this.dialog.open(ImageViewerComponent, {
      data: file,
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'image-viewer-dialog'
    });
  }
}
