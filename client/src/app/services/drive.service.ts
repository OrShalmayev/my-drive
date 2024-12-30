import {Injectable} from '@angular/core';
import {FileService} from './file.service';
import { SortConfig} from '../models/drive.model';
import {FileItem} from "../models/file.model";

@Injectable({
    providedIn: 'root'
})
export class DriveService {
    constructor(private fileService: FileService) {
    }

    sortFiles(items: FileItem[], config: SortConfig): FileItem[] {
        return [...items].sort((a, b) => {
            switch (config.key) {
                case 'name':
                    return config.direction === 'asc'
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                case 'date':
                    return config.direction === 'asc'
                        ? new Date(a.stats.mtime).getTime() - new Date(b.stats.mtime).getTime()
                        : new Date(b.stats.mtime).getTime() - new Date(a.stats.mtime).getTime();
                case 'size':
                    return config.direction === 'asc'
                        ? a.stats.size - b.stats.size
                        : b.stats.size - a.stats.size;
                default:
                    return 0;
            }
        });
    }

    filterFiles(items: FileItem[], searchQuery: string): FileItem[] {
        if (!searchQuery) return items;
        return items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    formatSize(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
    }
}
