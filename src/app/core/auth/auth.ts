import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface LoginDto { email: string; password: string; }
export interface RegisterDto { username: string; email: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private LS_USERS = 'biggame_users';
  private LS_TOKEN = 'biggame_token';
  private LS_ME = 'biggame_me';

  constructor(private router: Router) {}

  private readUsers(): any[] {
    return JSON.parse(localStorage.getItem(this.LS_USERS) || '[]');
  }
  private writeUsers(users: any[]) {
    localStorage.setItem(this.LS_USERS, JSON.stringify(users));
  }

  register(dto: RegisterDto): { ok: boolean; message?: string } {
    const users = this.readUsers();
    const exists = users.some((u: any) => u.email.toLowerCase() === dto.email.toLowerCase());
    if (exists) return { ok: false, message: 'อีเมลนี้ถูกใช้แล้ว' };

    const user = {
      id: crypto.randomUUID(),
      username: dto.username.trim(),
      email: dto.email.toLowerCase().trim(),
      passwordHash: btoa(dto.password), // เดโมเท่านั้น
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    this.writeUsers(users);
    return { ok: true };
  }

  login(dto: LoginDto): { ok: boolean; message?: string } {
    const users = this.readUsers();
    const u = users.find((x: any) => x.email.toLowerCase() === dto.email.toLowerCase());
    if (!u) return { ok: false, message: 'ไม่พบบัญชีผู้ใช้' };
    if (u.passwordHash !== btoa(dto.password)) return { ok: false, message: 'รหัสผ่านไม่ถูกต้อง' };

    const token = crypto.randomUUID();
    localStorage.setItem(this.LS_TOKEN, token);
    localStorage.setItem(this.LS_ME, JSON.stringify({ id: u.id, username: u.username, email: u.email }));
    return { ok: true };
  }

  logout() {
    localStorage.removeItem(this.LS_TOKEN);
    localStorage.removeItem(this.LS_ME);
    this.router.navigateByUrl('/');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.LS_TOKEN);
  }

  me(): { id: string; username: string; email: string } | null {
    const raw = localStorage.getItem(this.LS_ME);
    return raw ? JSON.parse(raw) : null;
  }
}
