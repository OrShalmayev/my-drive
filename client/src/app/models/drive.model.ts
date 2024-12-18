export interface DiskDetails {
  free: number;
  size: number;
}

export interface FileStats {
  size: number;
  mtime: Date;
}

export interface DriveItem {
  name: string;
  path: string;
  relativePath: string;
  stats: FileStats;
  isFolder: boolean;
  isImage?: boolean;
  isVideo?: boolean;
  files: DriveItem[];
  imageData?: string;
  videoId?: string;
}

export type ViewMode = 'grid' | 'list';
export type SortKey = 'name' | 'date' | 'size';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}
