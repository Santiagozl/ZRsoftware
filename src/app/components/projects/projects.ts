import { Component, OnInit, inject } from '@angular/core';
import { ContentService } from '../../content.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
})
export class Projects implements OnInit {
  protected readonly content = inject(ContentService);

  async ngOnInit(): Promise<void> {
    try {
      await this.content.loadProjects();
    } catch {
      // Se mantienen los casos iniciales si el CMS no está disponible.
    }
  }
}
