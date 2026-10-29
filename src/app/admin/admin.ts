import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentService } from '../content.service';
import { ContactRecord, Project } from '../project.model';

@Component({
  selector: 'app-admin',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly content = inject(ContentService);

  protected readonly authenticated = signal(false);
  protected readonly checkingSession = signal(true);
  protected readonly saving = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly notice = signal('');
  protected readonly error = signal('');
  protected readonly activeTab = signal<'projects' | 'messages'>('projects');

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly projectForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    summary: ['', [Validators.required, Validators.maxLength(280)]],
    category: ['', Validators.required],
    context: ['Proyecto de ZR Software', Validators.required],
    year: [new Date().getFullYear(), Validators.required],
    technologies: [''],
    imageUrl: [''],
    accent: ['green' as Project['accent'], Validators.required],
    featured: [false],
    published: [true],
    displayOrder: [1, Validators.required],
  });

  async ngOnInit(): Promise<void> {
    if (this.content.configured && (await this.content.hasSession())) {
      this.authenticated.set(true);
      await this.refreshData();
    }
    this.checkingSession.set(false);
  }

  protected async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.error.set('');
    try {
      const { email, password } = this.loginForm.getRawValue();
      await this.content.signIn(email, password);
      this.authenticated.set(true);
      await this.refreshData();
    } catch (error) {
      this.error.set(this.errorMessage(error));
    }
  }

  protected async logout(): Promise<void> {
    await this.content.signOut();
    this.authenticated.set(false);
  }

  protected startNew(): void {
    this.editingId.set(null);
    this.projectForm.reset({
      title: '',
      slug: '',
      summary: '',
      category: '',
      context: 'Proyecto de ZR Software',
      year: new Date().getFullYear(),
      technologies: '',
      imageUrl: '',
      accent: 'green',
      featured: false,
      published: true,
      displayOrder: this.content.projects().length + 1,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected edit(project: Project): void {
    this.editingId.set(project.id);
    this.projectForm.setValue({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      category: project.category,
      context: project.context,
      year: project.year,
      technologies: project.technologies.join(', '),
      imageUrl: project.imageUrl ?? '',
      accent: project.accent,
      featured: project.featured,
      published: project.published,
      displayOrder: project.displayOrder,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected createSlug(): void {
    if (this.projectForm.controls.slug.dirty) return;
    const slug = this.projectForm.controls.title.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    this.projectForm.controls.slug.setValue(slug);
  }

  protected async save(): Promise<void> {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.notice.set('');
    try {
      const value = this.projectForm.getRawValue();
      await this.content.saveProject({
        id: this.editingId() ?? undefined,
        ...value,
        imageUrl: value.imageUrl || null,
        technologies: value.technologies
          .split(',')
          .map((technology) => technology.trim())
          .filter(Boolean),
      });
      this.notice.set(this.editingId() ? 'Proyecto actualizado.' : 'Proyecto creado.');
      this.startNew();
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  protected async remove(project: Project): Promise<void> {
    if (!window.confirm(`¿Eliminar “${project.title}”? Esta acción no se puede deshacer.`)) return;
    try {
      await this.content.deleteProject(project.id);
      this.notice.set('Proyecto eliminado.');
    } catch (error) {
      this.error.set(this.errorMessage(error));
    }
  }

  protected async uploadImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.saving.set(true);
    try {
      const url = await this.content.uploadProjectImage(file);
      this.projectForm.controls.imageUrl.setValue(url);
      this.notice.set('Imagen cargada.');
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  protected async changeMessageStatus(
    message: ContactRecord,
    status: ContactRecord['status'],
  ): Promise<void> {
    try {
      await this.content.updateMessageStatus(message.id, status);
    } catch (error) {
      this.error.set(this.errorMessage(error));
    }
  }

  protected setTab(tab: 'projects' | 'messages'): void {
    this.activeTab.set(tab);
  }

  private async refreshData(): Promise<void> {
    try {
      await Promise.all([this.content.loadProjects(true), this.content.loadMessages()]);
    } catch (error) {
      this.error.set(this.errorMessage(error));
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
  }
}
