import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoginResponse } from '../../../core/models/user.model';
import { AuthService } from '../../../core/auth/auth';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-profile',
  imports: [Navbar, RouterModule,CommonModule, HttpClientModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  uid: string | null = null;
  user: LoginResponse | null = null;

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  async ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid');
    console.log('Profile UID:', this.uid);

    if (this.uid) {
      this.user = await this.authService.getUserByUid(this.uid);
      console.log('Fetched user:', this.user);
    }
  }
}
