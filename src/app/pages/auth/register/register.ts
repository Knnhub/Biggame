import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth'; // ✅ path ที่ถูกต้อง

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  // ✅ แก้: ใช้ inject(...) ก่อน แล้วค่อยนิยาม form
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]],
  });

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
    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    this.router.navigateByUrl('/login');
  }
}
