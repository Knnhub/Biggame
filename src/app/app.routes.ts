import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';    // ✅ เปลี่ยนเป็น Login
import { Register } from './pages/auth/register/register'; // ✅ เปลี่ยนเป็น Register
import { authGuard } from './core/guards/auth-guard';
import { Adminhome } from './pages/admin/adminhome/adminhome';
import { Userhome } from './pages/user/userhome/userhome';
import { Profile } from './pages/user/profile/profile';
import { EditProfile } from './pages/user/edit-profile/edit-profile';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },         // ✅ ใช้ Login
  { path: 'register', component: Register },   // ✅ ใช้ Register


  { path: 'adminhome/:uid', component: Adminhome, canActivate: [authGuard] },
  { path: 'userhome/:uid', component: Userhome, canActivate: [authGuard] },
  { path: 'profile/:uid', component: Profile, canActivate: [authGuard] },
    { path: 'editprofile/:uid', component: EditProfile, canActivate: [authGuard] },


  { path: '**', redirectTo: '' },

];
