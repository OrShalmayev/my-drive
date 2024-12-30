import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DriveService} from '../../services/drive.service';
import {FileService} from '../../services/file.service';
import {
    DiskDetails,
    SortConfig,
    ViewMode
} from '../../models/drive.model';
import {SortControlsComponent} from "./components/sort-controls/sort-controls.component";
import {FileItem} from "../../models/file.model";

@Component({
    selector: 'app-drive',
    standalone: true,
    imports: [CommonModule, FormsModule, SortControlsComponent],
    templateUrl: './drive.component.html',
    styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {
    files: FileItem[] = [];
    diskDetails?: DiskDetails;
    currentPath: string[] = [];
    currentFolder: FileItem[] = [];
    searchQuery: string = '';
    sortConfig: SortConfig = {key: 'name', direction: 'asc'};
    viewMode: ViewMode = 'grid';
    isUploading = false;
    isUploadMenuOpen = false;
    selectedItem: any = null;
    faceSearchResults: any[] = [];
    searchTimer: any;

    constructor(private fileService: FileService, private driveService: DriveService) {
    }

    ngOnInit() {
        this.loadFiles();
    }

    openItemMenu(event: MouseEvent, item: any) {
        event.stopPropagation();
        this.selectedItem = this.selectedItem === item ? null : item;
    }

    downloadItem(event: MouseEvent, item: any) {
        event.stopPropagation();
        this.selectedItem = null;

        if (item.isFolder) {
            // For folders, call the service to get a zip
            this.fileService.downloadFolder([...this.currentPath, item.name].join('/')).subscribe(
                (blob: Blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${item.name}.zip`;
                    link.click();
                    window.URL.revokeObjectURL(url);
                }
            );
        } else {
            // For single files, use the direct download endpoint
            const path = [...this.currentPath, item.name].join('/');
            window.open(`${this.fileService.apiUrl}/download?path=${encodeURIComponent(path)}`, '_blank');
        }
    }

    loadFiles() {
        this.fileService.getAllFiles().subscribe(response => {
            // @ts-ignore
            console.log(response);
            this.files = response.allFilesAndDirs;
            this.diskDetails = response.diskDetails;
            this.updateCurrentFolder();
        });
    }

    getCurrentFolderContents(): FileItem[] {
        let current = this.files;
        for (const path of this.currentPath) {
            const folder = current.find(f => f.name === path && f.isFolder);
            current = folder?.files || [];
        }
        return current;
    }

    updateCurrentFolder() {
        const filtered = this.driveService.filterFiles(this.getCurrentFolderContents(), this.searchQuery);
        this.currentFolder = this.driveService.sortFiles(filtered, this.sortConfig);
    }

    getFullPath(): string {
        return this.currentPath.join('/');
    }

    formatSize(bytes: number): string {
        return this.driveService.formatSize(bytes);
    }

    handleSort(key: 'name' | 'date' | 'size') {
        if (this.sortConfig.key === key) {
            this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortConfig = {key, direction: 'asc'};
        }
        this.updateCurrentFolder();
    }

    async handleFileUpload(event: any) {
        const files = event.target.files;
        if (files.length === 0) return;

        this.isUploading = true;
        const formData = new FormData();
        Array.from(files).forEach(file => {
            // @ts-ignore
            formData.append('files', file);
        });
        formData.append('path', this.currentPath.join('/'));

        try {
            await this.fileService.uploadFiles(Array.from(files), this.currentPath)
                .toPromise();
            this.loadFiles();
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            this.isUploading = false;
            this.isUploadMenuOpen = false;
        }
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

    navigateToIndex(index: number) {
        // Slice the path array up to the clicked index + 1
        this.currentPath = this.currentPath.slice(0, index + 1);
        this.updateCurrentFolder();
    }

    async searchByFace(item: FileItem) {
        if (!item.isImage) return;

        const imagePath = [...this.currentPath, item.name].join('/');
        this.fileService.searchByFace(imagePath).subscribe(
            results => {
                this.faceSearchResults = results;
                // Update the view to show matching images
                this.updateCurrentFolder();
            },
            error => console.error('Face search failed:', error)
        );
    }

    onSearchChange() {
        // Clear any existing timer
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        // Set a new timer to delay the search
        this.searchTimer = setTimeout(() => {
            if (this.searchQuery.startsWith('face:')) {
                // Extract the reference image path
                const imagePath = this.searchQuery.substring(5).trim();
                if (imagePath) {
                    this.fileService.searchByFace(imagePath).subscribe(
                        results => {
                            // Handle face search results
                            this.faceSearchResults = results;
                            this.updateCurrentFolder();
                        },
                        error => console.error('Face search failed:', error)
                    );
                }
            } else {
                this.updateCurrentFolder();
            }
        }, 500); // 500ms delay
    }
}
