


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from 'src/app/service/job.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// 
@Component({
  selector: 'app-update-job',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-job.component.html',
  styleUrls: ['./update-job.component.css']
})
export class UpdateJobComponent implements OnInit {
  jobId!: number;
  jobForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private jobSrv: JobService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.jobId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      jobType: ['', Validators.required],
      qualifications: ['', Validators.required],
      skills: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
    });

    this.getJobDetails();
  }

  getJobDetails() {
    this.isLoading = true;
    console.log('Fetching job details for Job ID:', this.jobId); // Debugging log
    this.jobSrv.GetJobListingById(this.jobId).subscribe({
      next: (jobData: any) => {
        // Map the jobData to match the Job interface structure
        const mappedJobData: Job = {
          title: jobData.title || '',
          description: jobData.description || '',
          location: jobData.location || '',
          jobType: jobData.jobType || '',
          qualifications: jobData.qualifications || '',
          skills: jobData.skills || '',
          salary: jobData.salary || 0,
        };
        console.log('Job Data:', jobData); // Debugging log
        // Patch the form with the mapped job data
        this.jobForm.patchValue(mappedJobData);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching job details', err);
        this.isLoading = false;
      }
    });
  }
  

  updateJob() {
    if (this.jobForm.invalid) return;
    const employerId = localStorage.getItem('employerId');
    if (!employerId) {
      alert('Employer not found');
      return;
    }

    const updatedJobData = {
      employerId: +employerId,
      ...this.jobForm.value,
    };
    console.log('Updating Job:', updatedJobData); // Debugging

    this.isLoading = true;
    this.jobSrv.UpdateJob(this.jobId, updatedJobData).subscribe({
      next: () => {
        alert('Job updated successfully');
        this.router.navigate(['/job-listing']);
      },
      error: (err) => {
        console.error('Error updating job:', err);
        if (err.status === 404) {
          alert('Job not found. Please check the job ID.');
        } else {
          alert('Failed to update job. Please try again.');
        }
        this.isLoading = false;
      }
    });
  }
}

// Interface definition directly in the component file
export interface Job {
  title: string;
  description: string;
  location: string;
  jobType: string;
  qualifications: string;
  skills: string;
  salary: number;
}







