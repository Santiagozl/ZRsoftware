import { Project } from './project.model';

/**
 * Contenido inicial visible mientras Supabase no esté configurado.
 * Los casos de experiencia están diferenciados de los proyectos contratados
 * directamente por ZR Software para no atribuir relaciones comerciales ajenas.
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'zr-digital',
    title: 'Identidad digital ZR',
    slug: 'identidad-digital-zr',
    summary:
      'Diseño y desarrollo de una experiencia corporativa rápida, accesible y preparada para crecer con el estudio.',
    category: 'Plataforma web',
    context: 'Proyecto interno',
    year: 2026,
    technologies: ['Angular 22', 'TypeScript', 'SCSS'],
    imageUrl: null,
    accent: 'green',
    featured: true,
    published: true,
    displayOrder: 1,
  },
  {
    id: 'health-tech',
    title: 'Ingeniería para health-tech',
    slug: 'ingenieria-health-tech',
    summary:
      'Participación profesional en la evolución de servicios empresariales para operaciones de salud con arquitecturas distribuidas.',
    category: 'Software empresarial',
    context: 'Experiencia del equipo',
    year: 2026,
    technologies: ['Spring Boot', 'Angular', 'Oracle', 'Docker'],
    imageUrl: null,
    accent: 'dark',
    featured: true,
    published: true,
    displayOrder: 2,
  },
  {
    id: 'web-mobile',
    title: 'Productos web y móviles',
    slug: 'productos-web-moviles',
    summary:
      'Experiencia construyendo aplicaciones conectadas de extremo a extremo, desde la lógica del servidor hasta la interfaz móvil.',
    category: 'Desarrollo multiplataforma',
    context: 'Experiencia del equipo',
    year: 2026,
    technologies: ['Laravel', 'Angular', 'Ionic', 'PostgreSQL'],
    imageUrl: null,
    accent: 'light',
    featured: false,
    published: true,
    displayOrder: 3,
  },
];
