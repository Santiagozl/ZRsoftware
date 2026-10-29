import { Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject } from '@angular/core';

interface CloudPoint {
  name: string;
  x: number;
  y: number;
  z: number;
}

@Component({
  selector: 'app-tech-stack',
  templateUrl: './tech-stack.html',
})
export class TechStack {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  protected readonly meridians = Array.from({ length: 14 }, (_, index) => index * (180 / 14));
  protected readonly latitudes = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
  protected readonly stars = Array.from({ length: 36 }, (_, index) => ({
    top: `${(index * 37) % 100}%`,
    left: `${(index * 53) % 100}%`,
    size: 2 + (index % 3),
    delay: `${(index % 8) * 0.35}s`,
  }));

  protected readonly technologies = [
    'Angular',
    'React',
    'TypeScript',
    'Spring',
    'Laravel',
    '.NET',
    'Node.js',
    'Ionic',
    'Flutter',
    'Kotlin',
    'Swift',
    'PostgreSQL',
    'Oracle',
    'Python',
    'TensorFlow',
    'Docker',
    'CI/CD',
    'Git',
  ];

  protected readonly groups = [
    {
      label: 'FRONTEND WEB',
      technologies: ['Angular', 'React', 'TypeScript', 'RxJS', 'NgRx', 'HTML5 / SCSS'],
    },
    {
      label: 'BACKEND',
      technologies: [
        'Java / Spring Boot',
        'PHP / Laravel',
        'C# / .NET',
        'Node.js / Express',
        'JPA / Hibernate',
        'REST / OpenAPI',
      ],
    },
    {
      label: 'MÓVIL',
      technologies: [
        'Ionic / Capacitor',
        'Flutter / Dart',
        'Kotlin / Android',
        'React Native',
        'iOS / Swift',
      ],
    },
    {
      label: 'DATOS',
      technologies: ['PostgreSQL', 'Oracle Database', 'MySQL', 'SQL Server', 'Modelado SQL'],
    },
    {
      label: 'DATOS E IA',
      technologies: [
        'Python',
        'Pandas',
        'NumPy',
        'Scikit-learn',
        'TensorFlow / PyTorch',
        'APIs de inferencia',
      ],
    },
    {
      label: 'ARQUITECTURA + DEVOPS',
      technologies: [
        'Microservicios',
        'Monolitos modulares',
        'Arquitectura por capas',
        'Docker',
        'CI/CD',
        'Git / Linux',
      ],
    },
  ];

  private readonly points = this.placeOnSphere(this.technologies);
  private nodes: HTMLElement[] = [];
  private angle = 0;
  private radius = 190;
  private pointerX = 0;
  private pointerY = 0;
  private frame = 0;

  constructor() {
    afterNextRender(() => this.start());
    this.destroyRef.onDestroy(() => cancelAnimationFrame(this.frame));
  }

  protected onPointerMove(event: PointerEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    this.pointerY = (event.clientY - rect.top) / rect.height - 0.5;
  }

  protected onPointerLeave(): void {
    this.pointerX = 0;
    this.pointerY = 0;
  }

  private placeOnSphere(names: string[]): CloudPoint[] {
    const count = names.length;
    const golden = Math.PI * (3 - Math.sqrt(5));

    return names.map((name, index) => {
      const y = 1 - (index / (count - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * index;
      return {
        name,
        x: Math.cos(theta) * radius,
        y,
        z: Math.sin(theta) * radius,
      };
    });
  }

  private start(): void {
    this.nodes = Array.from(this.host.nativeElement.querySelectorAll('.tech-cloud strong'));
    this.measure();
    this.project();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      const loop = () => {
        this.angle += 0.0022;
        this.project();
        this.frame = requestAnimationFrame(loop);
      };
      this.frame = requestAnimationFrame(loop);
    });
    window.addEventListener('resize', this.measure, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('resize', this.measure));
  }

  private readonly measure = (): void => {
    const stage = this.host.nativeElement.querySelector('.stack-globe') as HTMLElement | null;
    if (!stage) {
      return;
    }
    this.radius = Math.min(stage.clientWidth, stage.clientHeight) * 0.38;
  };

  private project(): void {
    const rotY = this.angle + this.pointerX * 0.9;
    const rotX = 0.32 + this.pointerY * 0.7;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    this.points.forEach((point, index) => {
      const node = this.nodes[index];
      if (!node) {
        return;
      }

      let x = point.x * cosY - point.z * sinY;
      let z = point.z * cosY + point.x * sinY;
      const y = point.y * cosX - z * sinX;
      z = z * cosX + point.y * sinX;
      const depth = (z + 1) / 2;

      node.style.opacity = `${0.18 + depth * 0.82}`;
      node.style.zIndex = `${Math.round(8 + depth * 40)}`;
      node.style.transform = `translate(-50%, -50%) translate(${x * this.radius}px, ${y * this.radius}px) scale(${0.58 + depth * 0.62})`;
    });
  }
}
