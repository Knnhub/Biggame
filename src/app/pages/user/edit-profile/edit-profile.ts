import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs'; // ✅ Import firstValueFrom
import { AuthService } from '../../../core/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../envirolments/environment';



@Component({
  standalone: true,
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule,CommonModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss']
})
export class EditProfile implements OnInit {
  // ✅ ต้องเพิ่ม apiBase เข้ามา เพื่อให้เรียก backend ได้
  // เปลี่ยนเป็น URL ของ Railway/backend ของคุณ
  // apiBase = 'http://localhost:8080'; // หรือ 'https://your-railway-backend-url.com'; 
  // คืน URL สำหรับรูปโปรไฟล์: ใช้รูป preview ก่อน > imageUser จากฟอร์ม > null
public avatarImg(): string | null {
  return this.previewURL() || this.form.value.imageUser || null;
}

// ให้ input[type=file] เรียกชื่อเดียวกับใน HTML แล้วส่งต่อไปใช้ของเดิม
public onAvatarChange(e: Event): void {
  this.onFile(e); // ใช้เมธอด onFile เดิมของคุณ
}



  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  
  uid = localStorage.getItem('uid'); // สมมติ login แล้วเก็บ uid ไว้
  form = this.fb.group({
    uid: [''],
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required],
    imageUser: ['']
  });

  previewURL = signal<string | null>(null);
  file?: File;
  message = signal('');
  loading = signal(false);
 

 constructor(private route: ActivatedRoute, private authService: AuthService) { }
  //  async ngOnInit() {
  //   this.uid = this.route.snapshot.paramMap.get('uid');
  //   console.log('Profile UID:', this.uid);

  //   if (this.uid) {
  //     this.user = await this.authService.getUserByUid(this.uid);
  //     console.log('Fetched user:', this.user);
  //   }
  // }
  // ✅ เรียก loadProfile() ทันทีที่ Component เริ่มทำงาน
  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid');
    console.log('Profile UID:', this.uid);
    if (this.uid) {
      this.loadProfile();
    } else {
      this.message.set('กรุณา Login ก่อน');
    }
  }


  // ดึงข้อมูล user ตาม UID
  // **loadProfile method ถูกปรับปรุงให้ใช้ firstValueFrom แทน toPromise()**
  async loadProfile() {
    if (!this.uid) return;
    this.loading.set(true);
    this.message.set(''); // Clear previous message
    try {
      const params = new HttpParams().set('uid', this.uid);
      
      const user: any = await firstValueFrom( // ✅ ใช้ firstValueFrom
        this.http.get(`${environment.apiBase}/userbyuid`, { params })
      );

      this.form.patchValue({
        uid: user.uid,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        imageUser: user.imageUser
      });
      this.form.markAsPristine(); // Set form state to pristine after loading
    } catch (err) {
      console.error('Load profile failed:', err);
      this.message.set('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      this.loading.set(false);
    }
  }

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0];
      const url = URL.createObjectURL(this.file);
      this.previewURL.set(url);
    }
  }

  // กด Save
  // **onSubmit method ถูกปรับปรุงให้ใช้ firstValueFrom แทน toPromise()**
  async onSubmit() {
    if (this.form.invalid || !this.uid) return;
    this.loading.set(true);
    this.message.set('');
    try {
      const formData = new FormData();
      formData.append('uid', this.uid);
      formData.append('full_name', this.form.value.full_name!);
      formData.append('email', this.form.value.email!);
      // role ไม่ต้องใส่ถ้า backend อนุญาตให้แก้ไขแค่ user/admin
      formData.append('role', this.form.value.role!); 
      if (this.file) formData.append('avatar', this.file);

      const res: any = await firstValueFrom( // ✅ ใช้ firstValueFrom
        this.http.post(`${environment.apiBase}/editprofile`, formData)
      );

      console.log('Updated:', res);
      this.message.set('บันทึกสำเร็จ ✅');
      this.router.navigate(['/profile', res.uid]);

      // อัพเดทรูปใหม่และเคลียร์ preview
      if (res.imageUser) this.form.patchValue({ imageUser: res.imageUser });
      this.previewURL.set(null);
      this.file = undefined; // เคลียร์ file ที่ถูกเลือก
      this.form.markAsPristine();
    } catch (err) {
      console.error('Save failed:', err);
      this.message.set('บันทึกไม่สำเร็จ ❌');
    } finally {
      this.loading.set(false);
    }
  }

  reset() {
    this.previewURL.set(null);
    this.file = undefined;
    this.loadProfile();
  }
}