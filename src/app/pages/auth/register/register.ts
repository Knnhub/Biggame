import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';


@Component({
selector: 'app-register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
loading = false;
form = this.fb.group({
username: ['', [Validators.required, Validators.minLength(3)]],
email: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required, Validators.minLength(6)]],
confirm: ['', [Validators.required]]
});


constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}


submit() {
if (this.form.invalid) return;
if (this.form.value.password !== this.form.value.confirm) {
this.form.get('confirm')?.setErrors({ mismatch: true });
return;
}
this.loading = true;
const { username, email, password } = this.form.value as any;
const res = this.auth.register({ username, email, password });
this.loading = false;
if (!res.ok) { alert(res.message); return; }
alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
this.router.navigateByUrl('/login');
}
}