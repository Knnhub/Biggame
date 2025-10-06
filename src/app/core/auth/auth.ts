import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../envirolments/environment';
import { LoginResponse } from '../models/user.model';
import { firstValueFrom } from 'rxjs';


export interface LoginDto { email: string; password: string; }
export interface RegisterDto { username: string; email: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private LS_TOKEN = 'biggame_token';
  private LS_ME = 'biggame_me';


  async registerFormData(formData: FormData): Promise<{ ok: boolean; message?: string; user?: LoginResponse }> {
    try {
      const res: LoginResponse = await firstValueFrom(
        this.http.post<LoginResponse>(`${environment.apiBase}/register`, formData)
      );

      // ถ้า backend ส่ง token ให้เก็บลง localStorage
      if ((res as any).token) {
        localStorage.setItem(this.LS_TOKEN, (res as any).token);
      }

      // เก็บข้อมูลผู้ใช้ลง localStorage
      // localStorage.setItem(this.LS_ME, JSON.stringify(res));

      return { ok: true, message: 'Registered successfully', user: res };
    } catch (err: any) {
      const msg =
        err?.error?.error ||
        err?.error?.message ||
        (typeof err?.error === 'string' ? err.error : null) ||
        'register failed';
      return { ok: false, message: msg };
    }
  }



  async login(dto: LoginDto): Promise<LoginResponse> {
    try {
      const res: LoginResponse = await firstValueFrom(
        this.http.post<LoginResponse>(`${environment.apiBase}/login`, dto)
      );

      // ตรวจสอบ response
      if (!res || !res.uid) {
        return {
          uid: '',
          email: '',
          full_name: '',
          role: 'user',
          message: 'No response from server'
        };
      }

      // สร้าง token เอง
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

      // เก็บข้อมูลผู้ใช้ลง localStorage
      localStorage.setItem(this.LS_ME, JSON.stringify(res));
      localStorage.setItem('token', token);

      // ✅ ส่ง token กลับด้วย
      return { ...res, token };
    } catch (err: any) {
      return {
        uid: '',
        email: '',
        full_name: '',
        role: 'user',
        message: err?.error?.error || err?.error?.message || 'Login failed'
      };
    }
  }



  logout() {
    localStorage.clear(); // all delete
    // localStorage.removeItem(this.LS_TOKEN);
    // localStorage.removeItem(this.LS_ME);

    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // true ถ้ามี token
  }


  token(): string | null {
    return localStorage.getItem(this.LS_TOKEN);
  }

  me(): { id: string; username: string; email: string } | null {
    const raw = localStorage.getItem(this.LS_ME);
    return raw ? JSON.parse(raw) : null;
  }

  async getUserByUid(uid: string): Promise<LoginResponse | null> {
    try {
      const res = await firstValueFrom(
        this.http.get<LoginResponse>(`${environment.apiBase}/userbyuid?uid=${uid}`)
      );
      return res;
    } catch (err) {
      console.error('Cannot get user by uid', err);
      return null;
    }
  }



}
