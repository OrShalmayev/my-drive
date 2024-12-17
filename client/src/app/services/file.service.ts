import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ServerResponse} from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:4002';

  constructor(private http: HttpClient) {}

  getAllFiles(): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${this.apiUrl}/all`);
  }

  uploadFiles(files: File[], folderName: string = 'uploads'): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('folderName', folderName);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getVideoUrl(videoId: string): string {
    return `${this.apiUrl}/video/${videoId}`;
  }
}

