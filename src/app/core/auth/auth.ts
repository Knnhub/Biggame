import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../envirolments/environment';
import { LoginResponse } from '../models/user.model';
import { firstValueFrom } from 'rxjs';
import { Getgame } from '../models/getgame';


export interface LoginDto { email: string; password: string; }
export interface RegisterDto { username: string; email: string; password: string; }
export interface DeleteResponse {
  message: string;
  error?: string;
}
export interface AddGameResponse {
  message: string;
  game_id: number;
}
export interface Game {
  game_id: number;
  game_name: string;
  price: number;
  image?: string;
  description?: string;
  release_date?: Date;
  type_id?: number | null; // Accepts number, null, or undefined
  // เพิ่ม field อื่นๆ ตามที่ API ส่งมา
}

export interface Wallet {
  wid: number;
  cash: number;
  user_id: number;
}

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
<<<<<<< HEAD
  async getGames(): Promise<Getgame[]> {
    try {
      // เรียก GET request ไปยัง endpoint /games และคาดหวังผลลัพธ์เป็น Array ของ Game
      const res = await firstValueFrom(
        this.http.get<Getgame[]>(`${environment.apiBase}/games`)
      );
      // หากสำเร็จ ให้ return ข้อมูลเกมที่ได้
      return res;
    } catch (err) {
      // หากเกิดข้อผิดพลาด ให้แสดง log และ return เป็น array ว่าง
      console.error('Cannot get games', err);
      return [];
    }
  }
  // ✅ ADD THIS NEW FUNCTION
  async deleteGame(gameId: string | number): Promise<{ ok: boolean; message: string }> {
    try {
      // Construct the URL with the ID as a query parameter
      const url = `${environment.apiBase}/deletegame?id=${gameId}`;

      // Send the DELETE request and wait for the response
      const response = await firstValueFrom(
        this.http.delete<DeleteResponse>(url)
      );

      return { ok: true, message: response.message || 'Game deleted successfully' };

    } catch (err: any) {
      console.error('Failed to delete game:', err);

      // Extract the specific error message from the backend
      const errorMessage = err?.error?.error || 'An unknown error occurred';

      return { ok: false, message: errorMessage };
    }
  }
  async addGame(formData: FormData): Promise<{ ok: boolean; message: string; game_id?: number }> {
    try {
      const url = `${environment.apiBase}/addGame`;

      // ส่ง POST request พร้อมกับ FormData
      const response = await firstValueFrom(
        this.http.post<AddGameResponse>(url, formData)
      );

      return { ok: true, message: response.message, game_id: response.game_id };

    } catch (err: any) {
      console.error('Failed to add game:', err);
      const errorMessage = err?.error?.error || 'An unknown error occurred while adding the game.';
      return { ok: false, message: errorMessage };
    }
  }

  async getWalletByUserID(uid: string): Promise<Wallet> {
    const url = `${environment.apiBase}/wallet?user_id=${uid}`;
    return await firstValueFrom(this.http.get<Wallet>(url));
  }

  async addFunds(uid: string, amount: number): Promise<any> {
    const url = `${environment.apiBase}/wallet/add`;
    const body = {
      user_id: parseInt(uid, 10), // แปลง uid ที่เป็น string ให้เป็น number
      amount: amount
    };
    // ยิง HTTP POST request พร้อมกับส่งข้อมูล body ไปด้วย
    return await firstValueFrom(this.http.post(url, body));
  }

  // กดดูข้อมูลเกมเดียว
  async getGameById(id: string): Promise<Game> {
    const url = `${environment.apiBase}/game?id=${id}`;
    return await firstValueFrom(this.http.get<Game>(url));
  }
=======


>>>>>>> 5dd40b7340fa7ef85a4833478de0aa24136902b8

}
