import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  loading = false;

  async submit() {
  this.form.markAllAsTouched();
  console.log('FORM VALUE', this.form.value, 'valid?', this.form.valid);

  if (this.form.invalid) {
    console.warn('FORM INVALID', this.form.errors, {
      email: this.form.get('email')?.errors,
      password: this.form.get('password')?.errors
    });
    return;
  }

  this.loading = true;
  const res = await this.auth.login(this.form.value as any);
  this.loading = false;

  if (!res.ok) {
    alert(res.message || 'login failed');
    return;
  }

  alert('Welcome Login Success!');
  this.router.navigateByUrl('/dashboard');
  }
}
