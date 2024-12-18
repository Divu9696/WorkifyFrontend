import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { Router, RouterLink } from '@angular/router';
import { JobService } from 'src/app/service/job.service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/service/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginObj: any = {
    email: "",
    password: ""
}

constructor(private authService: AuthService,private jobSrv: JobService, private router: Router) {}

onLogin() {
  this.authService.login(this.loginObj).subscribe(
    (res: any) => {
      if (res.user) {
        alert('User Logged in Successfully!');
        localStorage.setItem('jobLoginUser', JSON.stringify(res.user)); // Store the token in localStorage
        this.router.navigateByUrl('/home'); // Navigate to home page
        }
        else {
        alert('Login failed. Please try again.');
      }
    },
    (error) => {
      console.error('Login error:', error);
      alert('An error occurred during login. Please check your credentials and try again.');
    }
  );
}
}
