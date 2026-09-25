import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

export type ThemeMode = "light" | "dark";

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  //Constants
  private readonly DARK_MODE_CLASS: string = 'dark-mode';
  private readonly LIGHT_MODE: ThemeMode = "light";
  private readonly DARK_MODE: ThemeMode = "dark";

  private readonly THEME_COOKIE_NAME: string = "RedditEmblemMaps-SavedThem";

  //Internal attributes
  private readonly document = inject(DOCUMENT);
  private readonly browserPreference = window.matchMedia('(prefers-color-scheme: dark)');

  private themeMode = signal<ThemeMode>(
    //Set the default theme mode based on the user's browser preference
    this.browserPreference.matches ? this.DARK_MODE : this.LIGHT_MODE
  );
  public inDarkMode = computed(() => this.themeMode() === this.DARK_MODE );

  constructor(private readonly cookieService: CookieService){
    this.cookieService = inject(CookieService);

    //Watch for changes in the dark mode setting
    effect(() => {
      this.applyDarkModeClass(this.inDarkMode());
    });

    //Check if this user has a theme cookie stored
    const cookie: string = this.cookieService.get(this.THEME_COOKIE_NAME);
    if (cookie.length > 0 && (cookie === "light" || cookie === "dark"))
      this.themeMode.set(cookie as ThemeMode);
  }
  
  public toggleTheme() {
    this.themeMode.set(this.inDarkMode() ? this.LIGHT_MODE : this.DARK_MODE);

    //Set a cookie to track the current value, expires after 7 days
    this.cookieService.set(this.THEME_COOKIE_NAME, this.themeMode(), 7);
  }

  private applyDarkModeClass(inDarkMode: boolean): void {
    if(inDarkMode) this.document.body.classList.add(this.DARK_MODE_CLASS);
    else this.document.body.classList.remove(this.DARK_MODE_CLASS);
  }
}
