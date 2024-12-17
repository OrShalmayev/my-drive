import {Component, OnInit} from '@angular/core';
import {DiskDetails, FileItem} from '../../models/file.model';
import {FileService} from '../../services/file.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss'],
  imports: [
    NgIf,
    DatePipe,
    NgForOf
  ],
  standalone: true
})
export class DriveComponent implements OnInit {
  files: FileItem[] = [];
  diskDetails?: DiskDetails;
  currentPath: string[] = [];
  currentFolder: FileItem[] = [];
  selectedFile: any = {};
  isLoading: boolean

  constructor(protected fileService: FileService) {
  }

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.isLoading = true;
    this.fileService.getAllFiles().subscribe(response => {
      this.isLoading = false
      this.files = response.allFilesAndDirs;
      this.diskDetails = response.diskDetails;
      this.updateCurrentFolder();
    });
  }

  updateCurrentFolder() {
    let current = this.files;
    for (const path of this.currentPath) {
      const folder = current.find(f => f.name === path && f.isFolder);
      current = folder?.files || [];
    }
    this.currentFolder = current;
  }

  navigateToFolder(folder: FileItem) {
    if (folder.isFolder) {
      this.currentPath.push(folder.name);
      this.updateCurrentFolder();
    }
  }

  navigateUp() {
    this.currentPath.pop();
    this.updateCurrentFolder();
  }

  selectFile(file: FileItem) {
    this.selectedFile = file;
  }

  onFilesDropped(files: FileList) {
    const currentFolder = this.currentPath[this.currentPath.length - 1] || 'uploads';
    const fileArray = Array.from(files);
    this.fileService.uploadFiles(fileArray, currentFolder).subscribe(() => {
      this.loadFiles();
    });
  }

  formatSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }
}

// src/app/components/drive/drive.component.html
