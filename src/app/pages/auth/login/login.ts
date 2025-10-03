import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';


@Component({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.scss']
})
export class LoginComponent {
loading = false;
form = this.fb.group({
email: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required]]
});


constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}


submit() {
if (this.form.invalid) return;
this.loading = true;
const res = this.auth.login(this.form.value as any);
this.loading = false;
if (!res.ok) { alert(res.message); return; }
this.router.navigateByUrl('/'); // หรือ /dashboard
}
}