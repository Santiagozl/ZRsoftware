import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { ContactMessage, ContactRecord, Project, ProjectInput } from './project.model';
import { FALLBACK_PROJECTS } from './projects.data';

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  context: string;
  year: number;
  technologies: string[];
  image_url: string | null;
  accent: Project['accent'];
  featured: boolean;
  published: boolean;
  display_order: number;
};

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly client: SupabaseClient | null =
    environment.supabaseUrl && environment.supabaseAnonKey
      ? createClient(environment.supabaseUrl, environment.supabaseAnonKey)
      : null;

  readonly projects = signal<Project[]>(FALLBACK_PROJECTS);
  readonly messages = signal<ContactRecord[]>([]);
  readonly loading = signal(false);
  readonly configured = Boolean(this.client);

  async loadProjects(includeDrafts = false): Promise<void> {
    if (!this.client) return;

    this.loading.set(true);
    let query = this.client.from('projects').select('*').order('display_order');
    if (!includeDrafts) query = query.eq('published', true);

    const { data, error } = await query;
    this.loading.set(false);

    if (error) throw error;
    this.projects.set((data as ProjectRow[]).map((row) => this.fromRow(row)));
  }

  async sendMessage(message: ContactMessage): Promise<'sent' | 'email'> {
    if (!this.client) {
      const subject = encodeURIComponent(`Nuevo proyecto: ${message.projectType}`);
      const body = encodeURIComponent(
        `Nombre: ${message.name}\nCorreo: ${message.email}\nEmpresa: ${message.company || 'No indicada'}\n\nIdea:\n${message.message}`,
      );
      window.location.href = `mailto:${environment.contactEmail}?subject=${subject}&body=${body}`;
      return 'email';
    }

    const { error } = await this.client.from('contact_messages').insert({
      name: message.name,
      email: message.email,
      company: message.company || null,
      project_type: message.projectType,
      message: message.message,
    });

    if (error) throw error;
    return 'sent';
  }

  async loadMessages(): Promise<void> {
    this.ensureClient();
    const { data, error } = await this.client!.from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    this.messages.set(
      data.map((row) => ({
        id: row.id as string,
        name: row.name as string,
        email: row.email as string,
        company: (row.company as string | null) ?? '',
        projectType: row.project_type as string,
        message: row.message as string,
        status: row.status as ContactRecord['status'],
        createdAt: row.created_at as string,
      })),
    );
  }

  async updateMessageStatus(id: string, status: ContactRecord['status']): Promise<void> {
    this.ensureClient();
    const { error } = await this.client!.from('contact_messages').update({ status }).eq('id', id);
    if (error) throw error;
    await this.loadMessages();
  }

  async signIn(email: string, password: string): Promise<void> {
    this.ensureClient();
    const { error } = await this.client!.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    if (this.client) await this.client.auth.signOut();
  }

  async hasSession(): Promise<boolean> {
    if (!this.client) return false;
    const { data } = await this.client.auth.getSession();
    return Boolean(data.session);
  }

  async saveProject(project: ProjectInput): Promise<void> {
    this.ensureClient();
    const payload = this.toRow(project);
    const { error } = project.id
      ? await this.client!.from('projects').update(payload).eq('id', project.id)
      : await this.client!.from('projects').insert(payload);

    if (error) throw error;
    await this.loadProjects(true);
  }

  async deleteProject(id: string): Promise<void> {
    this.ensureClient();
    const { error } = await this.client!.from('projects').delete().eq('id', id);
    if (error) throw error;
    await this.loadProjects(true);
  }

  async uploadProjectImage(file: File): Promise<string> {
    this.ensureClient();
    const extension = file.name.split('.').pop() || 'webp';
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await this.client!.storage.from('project-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;

    return this.client!.storage.from('project-images').getPublicUrl(path).data.publicUrl;
  }

  private ensureClient(): void {
    if (!this.client) {
      throw new Error('Supabase no está configurado en src/environments/environment.ts.');
    }
  }

  private fromRow(row: ProjectRow): Project {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      summary: row.summary,
      category: row.category,
      context: row.context,
      year: row.year,
      technologies: row.technologies ?? [],
      imageUrl: row.image_url,
      accent: row.accent,
      featured: row.featured,
      published: row.published,
      displayOrder: row.display_order,
    };
  }

  private toRow(project: ProjectInput): Omit<ProjectRow, 'id'> {
    return {
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      category: project.category,
      context: project.context,
      year: project.year,
      technologies: project.technologies,
      image_url: project.imageUrl,
      accent: project.accent,
      featured: project.featured,
      published: project.published,
      display_order: project.displayOrder,
    };
  }
}
