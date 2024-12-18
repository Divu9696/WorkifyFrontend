import { Component, OnInit } from '@angular/core';
import { JobService } from '../service/job.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// import { JobService } from '../job.service';

@Component({
  selector: 'app-job-recommendations',
  imports:[CommonModule,RouterLink],
  templateUrl: './job-recommendations.component.html',
  styleUrls: ['./job-recommendations.component.css']
})
export class JobRecommendationsComponent implements OnInit {
  jobSeekerId: number | null = null; // To store the logged-in job seeker's ID
  jobRecommendations: any[] = []; // Array to store the job recommendations

  constructor(private jobService: JobService) {}

  ngOnInit() {
    // Get the job seeker ID from local storage using JobService
    this.jobSeekerId = this.jobService.getJobSeekerIdFromLocalStorage();

    if (this.jobSeekerId) {
      // Fetch job recommendations based on job seeker ID
      this.jobService.getJobRecommendations(this.jobSeekerId).subscribe(
        (recommendations) => {
          this.jobRecommendations = recommendations; // Store the recommendations in the array
        },
        (error) => {
          console.error('Error fetching job recommendations:', error);
        }
      );
    } else {
      console.error('Job Seeker ID is not available.');
    }
  }

  // Method to apply for a job
  applyForJob(jobId: number) {
    if (this.jobSeekerId) {
      const applicationData = {
        jobSeekerId: this.jobSeekerId,
        jobListingId: jobId
      };

      this.jobService.applyForJob(applicationData).subscribe(
        (response) => {
          console.log('Application submitted successfully:', response);
          alert('Successfully applied for the job!');
        },
        (error) => {
          console.error('Error applying for job:', error);
          alert('Error applying for the job. Please try again later.');
        }
      );
    } else {
      alert('Job Seeker ID is not available.');
    }
  }
}
