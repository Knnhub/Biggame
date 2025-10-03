import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';   // ใช้ HomeComponent
import { Login } from './pages/auth/login/login';    // ✅ เปลี่ยนเป็น Login
import { Register } from './pages/auth/register/register'; // ✅ เปลี่ยนเป็น Register
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: Login },         // ✅ ใช้ Login
  { path: 'register', component: Register },   // ✅ ใช้ Register
  { path: '**', redirectTo: '' },
];
