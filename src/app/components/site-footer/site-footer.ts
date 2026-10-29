import { Component } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  protected readonly currentYear = new Date().getFullYear();
}
