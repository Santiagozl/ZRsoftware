import { Component } from '@angular/core';

interface TechnologyGroup {
  label: string;
  technologies: string[];
}

@Component({
  selector: 'app-tech-stack',
  templateUrl: './tech-stack.html',
})
export class TechStack {
  protected readonly groups: TechnologyGroup[] = [
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
}
