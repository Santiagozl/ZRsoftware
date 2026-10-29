import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentService } from '../../content.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
})
export class Contact {
  private readonly formBuilder = inject(FormBuilder);
  private readonly content = inject(ContentService);

  protected readonly state = signal<'idle' | 'sending' | 'sent' | 'email' | 'error'>('idle');
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    projectType: ['Software a la medida', Validators.required],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1500)]],
    privacy: [false, Validators.requiredTrue],
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('sending');
    const value = this.form.getRawValue();

    try {
      const result = await this.content.sendMessage({
        name: value.name,
        email: value.email,
        company: value.company,
        projectType: value.projectType,
        message: value.message,
      });
      this.state.set(result);
      if (result === 'sent') {
        this.form.reset({
          name: '',
          email: '',
          company: '',
          projectType: 'Software a la medida',
          message: '',
          privacy: false,
        });
      }
    } catch {
      this.state.set('error');
    }
  }
}
