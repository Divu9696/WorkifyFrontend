import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/service/job.service'; // Your JobService
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-new-job',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-new-job.component.html',
  styleUrls: ['./create-new-job.component.css']
})
export class CreateNewJobComponent implements OnInit {
  company = {
    userId: 0,
    companyName: '',
    companyDescription: '',
    contactEmail: ''
  };

  job = {
    employerId: 0,
    title: '',
    description: '',
    location: '',
    jobType: '',
    qualifications: '',
    skills: '',
    salary: 0
  };

  userInfo: any;
  employerId: number | null = null; // Store the employerId if it exists
  showCompanyForm = false; // Control visibility of the company form
  jobList: any[] = []; 

  constructor(private jobService: JobService, private router: Router) {
    // Fetch userId from localStorage and set it to company.userId
    const userData = localStorage.getItem('jobLoginUser');
    if (userData !== null) {
      this.userInfo = JSON.parse(userData);
      this.company.userId = this.userInfo.id; 
    }
  }

  ngOnInit(): void {
    this.checkEmployerExists();
  }

  // Check if the employer exists for the current user
  checkEmployerExists() {
    this.jobService.getEmployers().subscribe((response: any[]) => {
      const employer = response.find(emp => emp.userId === this.company.userId);

      if (employer) {
        // Employer exists, store the employerId in local storage
        this.employerId = employer.id;
        localStorage.setItem('employerId', this.employerId?.toString() || '');
        //alert('Employer found! You can create jobs directly.');
        this.loadJobList();
      } else {
        // No employer exists, show the company form
      //  alert('New User!!First Add your company details.');
        this.showCompanyForm = true;
      }
    }, error => {
      console.error('Error fetching employers', error);
      alert('Unable to verify employer details');
    });
  }

   // Fetch the job list for the employer
loadJobList() {
  const employerId = localStorage.getItem('employerId');
  if (employerId) {
    this.jobService.GetJobsByEmployerId(+employerId).subscribe((response: any) => { 
      // Here, response should be the full response object, not just the array.
      if (Array.isArray(response)) {
        this.jobList = response;
      } else {
        console.error('Unexpected response format', response);
      }
    }, error => {
      console.error('Error fetching job list', error);
    });
  }
}


//  Function to add company and store the employerId in local storage
  onSubmitCompany() {
    this.jobService.addCompany(this.company).subscribe(response => {
      if (response && response.employerResponse) {
        this.employerId = response.employerResponse.id;

        // Check for null before setting to localStorage
        if (this.employerId !== null) {
          localStorage.setItem('employerId', this.employerId.toString());
          // Fetch the current job listings for this employer
          this.loadJobList();  // Fetch job list after company creation
        } else {
          console.error('Employer ID is null or undefined');
        }

        alert('Added company details successfully');
        this.showCompanyForm = false; // Hide the form after successful submission
      } else {
        alert('Failed to create company');
      }
    }, error => {
      console.error('Error while adding company', error);
      alert('Error creating company');
    });
  }

  // Function to post job with employerId from local storage
  onSubmitJob() {
    const employerId = localStorage.getItem('employerId');
    if (employerId) {
      this.job.employerId = +employerId; // Set employerId from local storage
      console.log('Employer ID for job:', this.job.employerId); // Debug log

      this.jobService.postJob(this.job).subscribe(response => {
        alert('Job posted successfully');
        // Fetch the updated job list for the employer
       // Fetch updated job list after posting a new job
       this.jobList.push(response); 
        this.router.navigate(['/jobs']); // Redirect to jobs listing or any other page
      }, error => {
        console.error('Error posting job', error);
        alert('Error posting job');
      });
    } else {
      alert('Employer ID is not found');
    }
  }
}

