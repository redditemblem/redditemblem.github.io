import { Component, inject, input, Signal, signal } from '@angular/core';
import { MatDivider, MatListModule } from '@angular/material/list';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ThemeService } from '../../../services/theme-service';

@Component({
  selector: 'links-sidenav',
  imports: [ MatListModule, RouterLink, MatIcon, MatDivider ],
  templateUrl: './links-sidenav.html',
  styleUrl: './links-sidenav.scss',
})
export class LinksSidenav {
  public googleWorksheetID = input<string | undefined>(undefined);
  public chapterPostUrl = input<string | undefined>(undefined);
  public showMapLink = input<boolean>(false);
  public showConvoyLink = input<boolean>(false);
  public showShopLink = input<boolean>(false);
  public showMapAnalyzerLink = input<boolean>(false);
  
  private routeTeamName = signal<string>('');
  protected teamName: Signal<string> = this.routeTeamName.asReadonly();

  constructor(private activatedRoute: ActivatedRoute, protected themeService: ThemeService) {
    this.activatedRoute = inject(ActivatedRoute);
    this.themeService = inject(ThemeService);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.routeTeamName.set(params['teamName']);
    });
  }
  
  protected getGoogleSheetUrl() : string {
    return `https://docs.google.com/spreadsheets/d/${this.googleWorksheetID()}/edit`;
  }
}
