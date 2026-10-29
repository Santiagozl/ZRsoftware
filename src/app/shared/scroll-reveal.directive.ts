import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

type RevealOrigin = 'up' | 'left' | 'right' | 'scale';

@Directive({
  selector: '[appScrollReveal]',
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer: IntersectionObserver | null = null;

  @Input() revealChildren = '';
  @Input() revealOrigin: RevealOrigin = 'up';
  @Input() revealDelay = 0;
  @Input() revealStagger = 80;

  ngAfterViewInit(): void {
    queueMicrotask(() => this.initialize());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private initialize(): void {
    const host = this.host.nativeElement;
    const targets = this.revealChildren
      ? Array.from(host.querySelectorAll<HTMLElement>(this.revealChildren))
      : [host];

    if (!targets.length) return;

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    for (const [index, target] of targets.entries()) {
      target.classList.add('scroll-reveal', `reveal-${this.revealOrigin}`);
      target.style.setProperty(
        '--reveal-delay',
        `${this.revealDelay + Math.min(index * this.revealStagger, 480)}ms`,
      );

      if (reducedMotion || typeof IntersectionObserver === 'undefined') {
        target.classList.add('is-revealed');
      }
    }

    if (reducedMotion || typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          this.observer?.unobserve(entry.target);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -7% 0px',
      },
    );

    targets.forEach((target) => this.observer?.observe(target));
  }
}
