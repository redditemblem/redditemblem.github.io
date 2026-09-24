import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {

  private small = signal<boolean>(false);
  public readonly isSmallWidth: Signal<boolean> = this.small.asReadonly();

  private medium = signal<boolean>(false);
  public readonly isMediumWidth: Signal<boolean> = this.medium.asReadonly();

  private large = signal<boolean>(false);
  public readonly isLargeWidth: Signal<boolean> = this.large.asReadonly();

  constructor(private breakpointObserver: BreakpointObserver)  {
    this.breakpointObserver = inject(BreakpointObserver);

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.small.set(result.matches);
      });

    this.breakpointObserver
      .observe([Breakpoints.Medium])
      .subscribe(result => {
        this.medium.set(result.matches);
      });

    this.breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge])
      .subscribe(result => {
        this.large.set(result.matches);
      });
  }
}
