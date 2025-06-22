import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FileInfo } from '../../models/file.model';
import { formatDate, formatFileSize } from '../../utils/format.utils';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="image-viewer-container">
      <div class="image-header">
        <h2>{{ data.filename }}</h2>
        <button mat-icon-button (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="image-content">
        <img [src]="data.fileUrl" [alt]="data.filename">
      </div>

      <div class="image-footer">
        <p>{{ formatFileSize(data.size) }} · {{ formatDate(data.lastModified) }}</p>
        <a [href]="data.fileUrl" download="{{data.filename}}" mat-raised-button color="primary">
          <mat-icon>download</mat-icon> Download
        </a>
      </div>
    </div>
  `,
  styles: [`
    .image-viewer-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .image-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    .image-header h2 {
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80%;
    }

    .image-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
      padding: 16px;
    }

    .image-content img {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
    }

    .image-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }

    .image-footer p {
      margin: 0;
      color: rgba(0, 0, 0, 0.6);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent {
  readonly data: FileInfo = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ImageViewerComponent>);

  // Use the utility functions from the imported file
  formatFileSize = formatFileSize;
  formatDate = formatDate;
}
