export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  context: string;
  year: number;
  technologies: string[];
  imageUrl: string | null;
  accent: 'green' | 'light' | 'dark';
  featured: boolean;
  published: boolean;
  displayOrder: number;
}

export type ProjectInput = Omit<Project, 'id'> & { id?: string };

export interface ContactMessage {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
}

export interface ContactRecord extends ContactMessage {
  id: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}
