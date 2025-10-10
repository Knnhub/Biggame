import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../../core/auth/auth';
import { Getgame } from '../../../core/models/getgame';


@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, Navbar],
  templateUrl: './userhome.html',
  styleUrls: ['./userhome.scss']
})
export class Userhome {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  uid: string | null = null;
  loading = false;
  error: string | null = null;
  games: Getgame[] = [];

  constructor() { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.uid = params.get('uid');
      console.log('User UID อัปเดตเป็น:', this.uid);
      this.loadGames();
    });
  }

  async loadGames(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      this.games = await this.authService.getGames();
      
      if (this.games.length > 0) {
        console.log(`✅ ดึงข้อมูลเกมสำเร็จ! จำนวน: ${this.games.length} รายการ`);
        console.table(this.games);
      } else {
        console.log('⚠️ ดึงข้อมูลสำเร็จ แต่รายการเกมว่างเปล่า');
      }
    } catch (e) {
      console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูลเกม:', e);
      this.error = 'ไม่สามารถเชื่อมต่อหรือดึงข้อมูลเกมจากเซิร์ฟเวอร์ได้';
      this.games = [];
    } finally {
      this.loading = false;
    }
  }
}