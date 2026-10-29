import { Component, ViewEncapsulation, signal } from '@angular/core';
import { Admin } from './admin/admin';
import { Contact } from './components/contact/contact';
import { DeliveryProcess } from './components/delivery-process/delivery-process';
import { Experience } from './components/experience/experience';
import { Faq } from './components/faq/faq';
import { Founders } from './components/founders/founders';
import { Hero } from './components/hero/hero';
import { Projects } from './components/projects/projects';
import { Services } from './components/services/services';
import { SiteFooter } from './components/site-footer/site-footer';
import { SiteHeader } from './components/site-header/site-header';
import { TechStack } from './components/tech-stack/tech-stack';
import { ScrollRevealDirective } from './shared/scroll-reveal.directive';

@Component({
  selector: 'app-root',
  imports: [
    Admin,
    Contact,
    DeliveryProcess,
    Experience,
    Faq,
    Founders,
    Hero,
    Projects,
    Services,
    SiteFooter,
    SiteHeader,
    ScrollRevealDirective,
    TechStack,
  ],
  encapsulation: ViewEncapsulation.None,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly adminMode = signal(new URLSearchParams(window.location.search).has('admin'));
}
