import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth'; // ✅ path ที่ถูกต้อง

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  // ✅ แก้: ใช้ inject(...) ก่อน แล้วค่อยนิยาม form
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loading = false;

  async submit() {
  if (this.form.invalid) return;

  this.loading = true;
  const res = await this.auth.login(this.form.value as any);
  this.loading = false;
  
  if (!res.ok) { alert(res.message); return; }
    this.router.navigateByUrl('/');

  if (!res.ok) {
    alert(res.message); // ❌ ไม่สำเร็จ แจ้ง error
    return;
  }

  // ✅ สำเร็จ
  alert(`Welcome Login Success!`);
  this.router.navigateByUrl('/dashboard'); // หรือไปหน้าอื่นที่คุณกำหนด  
  }
}
