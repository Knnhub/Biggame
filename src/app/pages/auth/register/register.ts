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
    username: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
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


  async submit() {
    if (this.form.invalid) return;

    this.loading = true;
    const { username, email, password } = this.form.value as any;
    const res = await this.auth.register({ username, email, password });
    this.loading = false;

    if (!res.ok) {
      alert(res.message); // ❌ สมัครไม่สำเร็จ
      return;
    }

    // ✅ สมัครสำเร็จ
    alert('Registered! Please login.');
    this.router.navigateByUrl('/login');
  }

}
