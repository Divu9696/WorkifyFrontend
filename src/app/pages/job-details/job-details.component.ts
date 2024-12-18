



import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobService } from 'src/app/service/job.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent {
   activeJobId: number = 0;
  jobObj: any;
  userInfo: any;
  isLoggedIn: boolean = false;
  showApplicationForm: boolean = false;
  jobSeekerId: number | null = null;
  resumeUrl: string | null = null;

  // Form to hold the application details
  applicationForm: FormGroup;

  constructor(
    private activateRoute: ActivatedRoute,
    private jobSrc: JobService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    const userData = localStorage.getItem('jobLoginUser');
    if (userData == null) {
      this.isLoggedIn = false;
    } else {
      this.isLoggedIn = true;
      this.userInfo = JSON.parse(userData); // Contains { id, username, email, role }
    }

    // Initialize form group with UserId from userInfo.id
    this.applicationForm = this.fb.group({
      UserId: [this.userInfo?.id || 0], // Use 'id' from jobLoginUser as UserId
      FullName: [this.userInfo?.username || ''], // Set FullName from username
      ContactNumber: [''],
      Education: [''],
      Skills: [''],
      resumeFile: [null]
    });

    // Subscribe to route params to get activeJobId
    this.activateRoute.params.subscribe((res: any) => {
      this.activeJobId = res.jobid;
      this.getJobDetail();
      this.checkExistingJobSeeker();  // Check if JobSeeker already exists
    });
  }

  // Fetch job details
  getJobDetail() {
    this.jobSrc.GetJobListingById(this.activeJobId).subscribe((res: any) => {
      this.jobObj = res;
    });
  }

  // Check if a JobSeeker ID exists for the current user
  checkExistingJobSeeker() {
    if (this.isLoggedIn && this.userInfo) {  // Check if userInfo is not null or undefined
      this.jobSrc.GetJobSeekers().subscribe((res: any[]) => {
        const existingJobSeeker = res.find(jobSeeker => jobSeeker.userId === this.userInfo.id);
        if (existingJobSeeker) {
          // If JobSeeker exists, store jobSeekerId in localStorage
          this.jobSeekerId = existingJobSeeker.id;
          this.resumeUrl = existingJobSeeker.resumePath;
          
          // Ensure jobSeekerId is not null before saving to localStorage
          if (this.jobSeekerId !== null) {
            localStorage.setItem('jobSeekerId', this.jobSeekerId.toString());
          } else {
            // Handle the case where jobSeekerId is null if needed
            console.error("Job Seeker ID is null");
          }
  
          // Optionally, show profile info here or disable the application form
        } else {
          // If no existing JobSeeker, show the application form
          this.showApplicationForm = true;
        }
      });
    }
  }
  
  
  // Toggle the visibility of the application form
  toggleApplicationForm() {
    this.showApplicationForm = !this.showApplicationForm;
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.applicationForm.patchValue({ resumeFile: file });
  }

  // Submit profile data
  submitProfile() {
    const formData = new FormData();
    formData.append('UserId', this.applicationForm.value.UserId);
    formData.append('FullName', this.applicationForm.value.FullName);
    formData.append('ContactNumber', this.applicationForm.value.ContactNumber);
    formData.append('Education', this.applicationForm.value.Education);
    formData.append('Skills', this.applicationForm.value.Skills);
    formData.append('resumeFile', this.applicationForm.value.resumeFile);

    // Send the application data to the backend
    this.jobSrc.CreateJobSeeker(formData).subscribe({
      next: (res) => {
        if (res?.jobSeekerId) {  // Check if res and res.id are not null or undefined
          alert('Profile Created Successfully!');
          this.jobSeekerId = res.jobSeekerId; 
          this.resumeUrl = res.resumePath;// Set the newly created jobSeekerId
    
          // Check if jobSeekerId is not null before calling setItem
          if (this.jobSeekerId !== null && this.jobSeekerId !== undefined) {
            localStorage.setItem('jobSeekerId', this.jobSeekerId.toString());
          } else {
            console.error("Job Seeker ID is null or undefined");
          }
    
          this.showApplicationForm = false;
        } else {
          alert('Profile creation failed: No ID returned.');
        }
      },
      error: (err) => {
        alert('Error submitting profile');
      }
    });
    
    
  }


  applyForJob() {
    if (this.jobSeekerId === null) {
      // If jobSeekerId doesn't exist in localStorage, show an alert
      alert("New user!! First, add your profile");
      return; // Prevent further execution
    }
  
    // Check if the job seeker has already applied for this job
    this.jobSrc.getApplicationsByJobSeekerId(this.jobSeekerId).subscribe({
      next: (applications) => {
        // Debugging logs
        console.log("Fetched applications:", applications);
        console.log("Active Job ID:", this.activeJobId);
  
        // Convert IDs to numbers (if necessary) to ensure proper comparison
        const alreadyApplied = applications.some(
          (app: any) => +app.jobListingId === +this.activeJobId // Force both IDs to be numbers
        );
  
        if (alreadyApplied) {
          alert("You have already applied for this job!");
        } else {
          // If not already applied, proceed with the application
          const applicationData = {
            jobSeekerId: this.jobSeekerId!, // Use non-null assertion operator
            jobListingId: this.activeJobId,
          };
  
          console.log("Submitting application:", applicationData);
  
          this.jobSrc.applyForJob(applicationData).subscribe({
            next: () => {
              alert("Application submitted successfully!");
            },
            error: (err) => {
              console.error("Error applying for job:", err); // Debugging
              alert("Error applying for job");
            },
          });
        }
      },
      error: (err) => {
        console.error("Error fetching applications:", err); // Debugging
        alert("Error checking previous applications");
      },
    });
  }
  
    
}

