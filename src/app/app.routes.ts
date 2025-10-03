import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';


const routes: Routes = [
{ path: '', component: HomeComponent, pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },


// ตัวอย่างหน้า protected ภายหลัง (ล๊อกอินแล้วถึงเข้าได้)
// { path: 'dashboard', canActivate: [AuthGuard], loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },


{ path: '**', redirectTo: '' },
];


@NgModule({
imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
exports: [RouterModule]
})
export class AppRoutingModule {}