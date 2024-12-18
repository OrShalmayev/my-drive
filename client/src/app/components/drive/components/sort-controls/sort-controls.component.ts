import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SortConfig} from "../../../../models/drive.model";

@Component({
    selector: 'app-sort-controls',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white border-b px-4 py-2 flex items-center space-x-4">
      <button
        *ngFor="let option of sortOptions"
        (click)="handleSort(option.key)"
        [class.bg-gray-200]="sortConfig.key === option.key"
        class="px-3 py-1 rounded hover:bg-gray-100 flex items-center space-x-1"
      >
        <span>{{ option.label }}</span>
        <ng-container *ngIf="sortConfig.key === option.key">
          <svg *ngIf="sortConfig.direction === 'asc'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"/>
          </svg>
          <svg *ngIf="sortConfig.direction === 'desc'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"/>
          </svg>
        </ng-container>
      </button>
    </div>
  `
})
export class SortControlsComponent {
    @Input() sortConfig!: SortConfig;
    @Output() sortChange = new EventEmitter<SortConfig>();

    sortOptions = [
        { key: 'name', label: 'Name' },
        { key: 'date', label: 'Date' },
        { key: 'size', label: 'Size' }
    ] as const;

    handleSort(key: 'name' | 'date' | 'size') {
        const newDirection = this.sortConfig.key === key && this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        this.sortChange.emit({ key, direction: newDirection });
    }
}