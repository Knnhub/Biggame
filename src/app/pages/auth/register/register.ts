import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  avatarPreview: string | null = null;

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]],
    avatar: [null as File | null] // optional
  });

  onAvatarChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.form.patchValue({ avatar: file });
    const reader = new FileReader();
    reader.onload = () => (this.avatarPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  loading = false;

  submit() {
    if (this.form.invalid) return;
    if (this.form.value.password !== this.form.value.confirm) {
      this.form.get('confirm')?.setErrors({ mismatch: true });
      return;
    }
    this.loading = true;
    const { username, email, password } = this.form.value as any;
    const res = this.auth.register({ username, email, password });
    this.loading = false;
    if (!res.ok) { alert(res.message); return; }
    alert('Registered! Now please login.');
    this.router.navigateByUrl('/login');
  }
}
