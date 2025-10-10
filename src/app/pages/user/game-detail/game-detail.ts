import { Component, inject, OnInit} from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../../../core/auth/auth';
import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [ CommonModule,Navbar],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss'
})
export class GameDetail {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  game: Game | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    // ดึง id จาก URL
    console.log('✅ GameDetailComponent ทำงานแล้ว! ngOnInit ถูกเรียก');

    const gameId = this.route.snapshot.paramMap.get('id');
    
    if (gameId) {
      this.loadGameDetails(gameId);
    } else {
      this.error = "ไม่พบ ID ของเกมใน URL";
      this.loading = false;
    }
  }

  async loadGameDetails(id: string) {
    this.loading = true;
    this.error = null;
    try {
      this.game = await this.authService.getGameById(id);
    } catch (err) {
      console.error("Failed to load game details:", err);
      this.error = "ไม่สามารถโหลดรายละเอียดเกมได้";
    } finally {
      this.loading = false;
    }
  }
}
