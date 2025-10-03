// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <nav class="topbar">
      <a routerLink="/" class="brand">BigGame</a>
      <span class="spacer"></span>
      <a routerLink="/login">Login</a>
      <a routerLink="/register">Register</a>
    </nav>
    <main class="page">
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {}
