import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ServerResponse} from "../models/file.model";

@Injectable({
    providedIn: 'root'
})
export class FileService {
    apiUrl = 'http://localhost:4002/api';

    constructor(private http: HttpClient) {
    }
    getAllFiles(): Observable<ServerResponse> {
        return this.http.get<ServerResponse>(`${this.apiUrl}/all`);
    }
    searchByFace(referenceImagePath: string): Observable<any[]> {
        return this.http.post<any[]>(`${this.apiUrl}/face-search`, {referenceImagePath});
    }

    getFiles(path: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/files?path=${path}`);
    }
    uploadFiles(files: File[], currentPath: string[] = []): Observable<any> {
        const formData = new FormData();
        formData.append('path', currentPath.join('/'));
        files.forEach(file => {
            formData.append('files', file);
        });
        return this.http.post(`${this.apiUrl}/upload`, formData);
    }

    uploadFile(path: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/upload?path=${path}`, formData);
    }
    createFolder(name: string, currentPath: string[]): Observable<any> {
        const path = [...currentPath, name].join('/');
        return this.http.post(`${this.apiUrl}/createFolder`, { path });
    }
    downloadFile(path: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/download?path=${path}`, {
            responseType: 'blob'
        });
    }

    downloadFolder(path: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/download-folder`, {
            params: {path},
            responseType: 'blob'
        });
    }

    deleteItem(path: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete?path=${path}`);
    }

    zipFiles(paths: string[]): Observable<Blob> {
        return this.http.post(`${this.apiUrl}/zip`, {paths}, {responseType: 'blob'});
    }

}
