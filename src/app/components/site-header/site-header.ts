import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('window:keydown.escape')
  protected onEscape(): void {
    this.closeMenu();
  }
}
