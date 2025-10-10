import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoginResponse } from '../../../core/models/user.model';
<<<<<<< HEAD
import { AuthService , Wallet} from '../../../core/auth/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
=======
import { AuthService } from '../../../core/auth/auth';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
>>>>>>> 5dd40b7340fa7ef85a4833478de0aa24136902b8



@Component({
  selector: 'app-profile',
<<<<<<< HEAD
  imports: [Navbar, RouterModule, CommonModule, FormsModule],
=======
  imports: [Navbar, RouterModule,CommonModule, HttpClientModule],
>>>>>>> 5dd40b7340fa7ef85a4833478de0aa24136902b8
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})

export class Profile {
  uid: string | null = null;
  user: LoginResponse | null = null;
  wallet: Wallet | null = null; 

  isAddFundsModalVisible = false;
  predefinedAmounts = [100, 200, 500, 1000];
  selectedAmount: number | null = null;
  customAmount: number | null = null;


  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  async ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid');
    console.log('Profile UID:', this.uid);

    if (this.uid) {
      this.user = await this.authService.getUserByUid(this.uid);
      console.log('Fetched user:', this.user);

      try {
        this.wallet = await this.authService.getWalletByUserID(this.uid);
        console.log('Fetched wallet:', this.wallet);
      } catch (error) {
        console.error('Could not fetch wallet:', error);
      }
    }
  }

  async addFunds() {
    // 1. ถามผู้ใช้ว่าต้องการเติมเงินเท่าไหร่
    const amountStr = prompt("กรุณาใส่จำนวนเงินที่ต้องการเติม:", "100");

    // 2. ตรวจสอบข้อมูลที่ผู้ใช้กรอก
    if (amountStr === null) {
      // ผู้ใช้กด Cancel
      return;
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("กรุณาใส่จำนวนเงินที่ถูกต้อง");
      return;
    }
    
    if (!this.uid) {
        alert("ไม่พบ User ID");
        return;
    }

    // 3. เรียกใช้ Service เพื่อยิง API
    try {
      console.log(`กำลังเติมเงิน ${amount} บาท สำหรับ User ID: ${this.uid}`);
      await this.authService.addFunds(this.uid, amount);

      // 4. ถ้าสำเร็จ: แจ้งเตือนและอัปเดตข้อมูล Wallet บนหน้าจอ
      alert("เติมเงินสำเร็จ!");
      // เรียกข้อมูล Wallet ใหม่เพื่ออัปเดตยอดเงิน
      this.wallet = await this.authService.getWalletByUserID(this.uid);
      
    } catch (error) {
      // 5. ถ้าล้มเหลว: แจ้งเตือน Error
      console.error("การเติมเงินล้มเหลว:", error);
      alert("เกิดข้อผิดพลาดในการเติมเงิน");
    }
  }


   openAddFundsModal(): void {
    this.isAddFundsModalVisible = true;
  }

  closeAddFundsModal(): void {
    this.isAddFundsModalVisible = false;
    this.selectedAmount = null; // รีเซ็ตค่าเมื่อปิด
    this.customAmount = null;
  }

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
    this.customAmount = null; // ล้างค่าในช่องกรอกเอง
  }

  clearSelectedAmount(): void {
    // ถ้าผู้ใช้เริ่มพิมพ์ในช่องกรอกเอง ให้ยกเลิกการเลือกปุ่ม
    this.selectedAmount = null;
  }

  // ✅ 5. เปลี่ยนชื่อฟังก์ชันเดิมเป็น confirmAddFunds และปรับแก้ Logic
  async confirmAddFunds() {
    // หาจำนวนเงินที่จะเติม โดยให้ความสำคัญกับช่องกรอกเองก่อน
    const amountToAdd = this.customAmount || this.selectedAmount;

    if (!amountToAdd || amountToAdd <= 0) {
      alert("กรุณาเลือกหรือกรอกจำนวนเงินที่ถูกต้อง");
      return;
    }
    
    if (!this.uid) {
      alert("ไม่พบ User ID");
      return;
    }

    try {
      console.log(`กำลังเติมเงิน ${amountToAdd} บาท สำหรับ User ID: ${this.uid}`);
      await this.authService.addFunds(this.uid, amountToAdd);

      alert("เติมเงินสำเร็จ!");
      
      // ปิด Modal และอัปเดตข้อมูล Wallet
      this.closeAddFundsModal(); 
      this.wallet = await this.authService.getWalletByUserID(this.uid);
      
    } catch (error) {
      console.error("การเติมเงินล้มเหลว:", error);
      alert("เกิดข้อผิดพลาดในการเติมเงิน");
    }
  }
  
}
