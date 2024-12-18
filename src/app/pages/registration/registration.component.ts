import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http'; // Import HttpClientModule
import { inject } from '@angular/core';
import { JobService } from 'src/app/service/job.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  userObj: any = {
       username: '',
        email: '',
        password:'',
        role: "Jobseeker"
      
         // Default role set to JobSeeker
  };
// Dropdown options for role selection
roles = ['JobSeeker', 'Employer'];

constructor(private jobService: JobService,private router: Router,) {}

register() {
console.log('Request Payload:', this.userObj); // Log request payload
  
this.jobService.registerUser(this.userObj).subscribe(
  (res: any) => {
    console.log('API Response:', res); // Log API response
    if (res.message) {
      alert(res.message); // Display the success message from the API response
      console.log('User registered successfully:', res.message);
      this.resetForm();
      this.router.navigate(['/login']); // Reset the form after success
    } else {
      console.error('Unexpected API Response:', res);
      alert('Registration failed. Please try again.');
    }
  },
  (error) => {
    console.error('API Error:', error); // Log error details
    alert('An error occurred during registration. Please try again.');
  }
);

}



// Reset the form after successful registration
resetForm() {
      this.userObj = {
       username: '',
        email: '',
        password:'',
        role: "Jobseeker"
};
}
}
















