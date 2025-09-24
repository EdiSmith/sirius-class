import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Features } from "./components/features/features";
import { Pricing } from "./components/pricing/pricing";
import { Testimonials } from "./components/testimonials/testimonials";
import { Cta } from "./components/cta/cta";
import { Footer } from "./components/footer/footer";
import { Hero } from './components/hero/hero';
import { AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Features, Pricing, Testimonials, Cta, Footer, Hero],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  private anchorListeners: Array<{ el: Element, handler: EventListenerOrEventListenerObject }> = [];
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    // Smooth scroll for in-page anchors
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      const handler = (e: Event) => {
        e.preventDefault();
        const targetId = (anchor as HTMLAnchorElement).getAttribute('href')!;
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId) as HTMLElement | null;
        if (targetEl) {
          window.scrollTo({
            top: targetEl.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      };
      anchor.addEventListener('click', handler);
      this.anchorListeners.push({ el: anchor, handler });
    });

    // IntersectionObserver for reveal animations
    const options = { root: null, rootMargin: '0px', threshold: 0.1 };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, options);

    const animatedEls = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
    animatedEls.forEach(el => {
      el.classList.add('animate-init');
      this.observer!.observe(el);
      // slight timed reveal for initial load feel
      setTimeout(() => {
        (el as HTMLElement).classList.add('animate-in');
      }, 100);
    });
  }

  ngOnDestroy(): void {
    // remove anchor listeners
    this.anchorListeners.forEach(item => {
      item.el.removeEventListener('click', item.handler);
    });
    this.anchorListeners = [];

    // disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}