import {Injectable} from '@angular/core';
import {FileService} from './file.service';
import {DriveItem, SortConfig} from '../models/drive.model';

@Injectable({
    providedIn: 'root'
})
export class DriveService {
    constructor(private fileService: FileService) {
    }

    sortFiles(items: DriveItem[], config: SortConfig): DriveItem[] {
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

    filterFiles(items: DriveItem[], searchQuery: string): DriveItem[] {
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
