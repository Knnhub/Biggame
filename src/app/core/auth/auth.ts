import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../envirolments/environment';


export interface LoginDto { email: string; password: string; }
export interface RegisterDto { username: string; email: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private LS_TOKEN = 'biggame_token';
  private LS_ME = 'biggame_me';


    async register(dto: { username: string; email: string; password: string; }): Promise<{ok:boolean; message?:string}> {
    // สร้าง uid ง่าย ๆ ฝั่ง client (ตาม backend ต้องการ)
    const uid = 'U' + Math.floor(1000 + Math.random() * 9000).toString(); // เช่น U1234

    const body = {
      uid,
      full_name: dto.username.trim(),
      email: dto.email.trim().toLowerCase(),
      password: dto.password,
      role: 'user'
    };

    try {
      await this.http.post(`${environment.apiBase}/register`, body).toPromise();
      return { ok: true, message: 'Registered successfully' };
    } catch (err: any) {
      // backend คืนข้อความ error ผ่าน { "error": "..."} หรือเป็น text
      const msg =
        err?.error?.error ||
        err?.error?.message ||
        (typeof err?.error === 'string' ? err.error : null) ||
        'register failed';
      return { ok: false, message: msg };
    }
  }


  async login(dto: LoginDto): Promise<{ok:boolean; message?:string; user?:any}> {
  try {
    const res: any = await this.http.post(`${environment.apiBase}/login`, dto).toPromise();
    localStorage.setItem(this.LS_TOKEN, res.token);
    localStorage.setItem(this.LS_ME, JSON.stringify(res.user));
    return { ok: true, user: res.user };
  } catch (err: any) {
    const msg = err?.error?.error || 'login failed';
    return { ok: false, message: msg };
  }
}


  logout() {
    localStorage.removeItem(this.LS_TOKEN);
    localStorage.removeItem(this.LS_ME);
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.LS_TOKEN);
  }
  token(): string | null {
    return localStorage.getItem(this.LS_TOKEN);
  }
  me(): { id:string; username:string; email:string } | null {
    const raw = localStorage.getItem(this.LS_ME);
    return raw ? JSON.parse(raw) : null;
  }
}
