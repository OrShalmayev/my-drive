import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {DriveComponent} from './components/drive/drive.component';
import {NavComponent} from './components/nav/nav.component';

export interface Root {
  diskDetails: DiskDetails
  allFilesAndDirs: AllFilesAndDir[]
}

export interface DiskDetails {
  diskPath: string
  free: number
  size: number
}

export interface AllFilesAndDir {
  dirent: Dirent
  name: string
  path: string
  stats: Stats
  isFolder: boolean
  isImage: boolean
  isVideo: boolean
  images?: Image[]
  buffer?: Buffer2
}

export interface Dirent {
  name: string
  path: string
}

export interface Stats {
  dev: number
  mode: number
  nlink: number
  uid: number
  gid: number
  rdev: number
  blksize: number
  ino: number
  size: number
  blocks: number
  atimeMs: number
  mtimeMs: number
  ctimeMs: number
  birthtimeMs: number
  atime: string
  mtime: string
  ctime: string
  birthtime: string
}

export interface Image {
  dirent: Dirent2
  name: string
  path: string
  stats: Stats2
  isFolder: boolean
  buffer: Buffer
}

export interface Dirent2 {
  name: string
  path: string
}

export interface Stats2 {
  dev: number
  mode: number
  nlink: number
  uid: number
  gid: number
  rdev: number
  blksize: number
  ino: number
  size: number
  blocks: number
  atimeMs: number
  mtimeMs: number
  ctimeMs: number
  birthtimeMs: number
  atime: string
  mtime: string
  ctime: string
  birthtime: string
}

export interface Buffer {
  type: string
  data: number[]
}

export interface Buffer2 {
  type: string
  data: number[]
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgForOf, AsyncPipe, NgIf, DriveComponent, NavComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
