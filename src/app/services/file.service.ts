import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { FileInfo } from '../models/file.model';
import { BASE_URL } from '../app.tokens';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(BASE_URL);

  /**
   * Get files for a specific user
   *
   * @param username The username to fetch files for
   * @returns An Observable of FileInfo array
   */
  getUserFiles(username: string): Observable<FileInfo[]> {
    return this.http.get<FileInfo[]>(`${this.baseUrl}/files/list/${username}`)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('Error fetching files:', error);
          return throwError(() => new Error('Failed to load files. Please try again later.'));
        })
      );
  }
}
