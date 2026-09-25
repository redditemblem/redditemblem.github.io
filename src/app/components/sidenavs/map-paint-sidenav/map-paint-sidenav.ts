import { Component, inject, signal } from '@angular/core';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MapEventService } from '../../../services/map-event-service';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from "@angular/material/input";
import { ThemeService } from '../../../services/theme-service';
import { MatButtonModule } from '@angular/material/button';
import { StringDictionary } from '../../../data/interfaces/common/dictionaries';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'map-paint-sidenav',
  imports: [MatListModule, MatIconModule, MatButtonToggleModule, MatInputModule, MatButtonModule, KeyValuePipe],
  templateUrl: './map-paint-sidenav.html',
  styleUrl: './map-paint-sidenav.scss',
})
export class MapPaintSidenav {

  /** Key is pen color, value is button display color */
  protected readonly availablePenColors: StringDictionary<string> = {
    'hotpink': 'hotpink',
    'red': 'red',
    'orange': 'orange',
    'yellow': 'yellow',
    'lawngreen': 'lawngreen',
    'cyan': 'cyan',
    'blue': 'blue',
    'blueviolet': 'blueviolet',
    'white': 'white',
    'black': '#333333'
  };
  protected selectedPenColor = signal<string>("black");

  constructor(protected themeService: ThemeService, private eventService: MapEventService) {
    this.eventService = inject(MapEventService);
  }

  protected doNotSort() : number {
    return 0;
  }

  protected exportMapAsImage() {
    this.eventService.triggerMapImageDownload();
  }

  protected drawingTool_OnChange(event: MatButtonToggleChange) {

  }

  protected penWidth_OnChange(event: MatButtonToggleChange) {
    this.eventService.setPenWidth(event.value as number);
  }

  protected setPenColor(color: string) {
    this.selectedPenColor.set(color);
    this.eventService.setPenColor(color);
  }

  protected eraseAllPaint() {
    this.eventService.eraseAllPaint();
  }

  protected undoLastLine() {
    this.eventService.undoLastLine();
  }
}
