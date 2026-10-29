import { Component, signal } from '@angular/core';

interface FrequentlyAskedQuestion {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.html',
})
export class Faq {
  protected readonly openQuestion = signal<number | null>(0);
  protected readonly questions: FrequentlyAskedQuestion[] = [
    {
      question: '¿Trabajan con proyectos desde cero?',
      answer:
        'Sí. Podemos acompañarte desde la definición del alcance hasta el diseño, desarrollo, despliegue y evolución del producto.',
    },
    {
      question: '¿También pueden mejorar un sistema existente?',
      answer:
        'Sí. Evaluamos la arquitectura actual, deuda técnica y riesgos operativos para proponer una modernización gradual sin detener la operación.',
    },
    {
      question: '¿Cómo estiman tiempos y costos?',
      answer:
        'Definimos alcance, supuestos, dependencias y prioridades. A partir de esa información entregamos una estimación por fases con entregables verificables.',
    },
    {
      question: '¿Qué ocurre después del lanzamiento?',
      answer:
        'Podemos continuar con soporte, observabilidad, corrección de incidentes, optimización y desarrollo de nuevas versiones.',
    },
  ];

  protected toggle(index: number): void {
    this.openQuestion.update((current) => (current === index ? null : index));
  }
}
