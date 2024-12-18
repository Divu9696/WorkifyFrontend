
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from 'src/app/service/job.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent implements OnInit {
  jobList: any[] = [];
  filterForm: FormGroup;
  showFilters: boolean = false; // Track whether filters are visible

  constructor(private jobSer: JobService, private router: Router, private fb: FormBuilder) {
    // Initialize the filter form
    this.filterForm = this.fb.group({
      title: [''],
      location: [''],
      minSalary: [''],
      jobType: [''],
      skills: [''],
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.jobSer.GetActiveJobs().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        this.jobList = res;
      },
      (error) => {
        console.error('Error fetching jobs:', error); // Handle errors gracefully
      }
    );
  }

  applyFilter() {
    const filterData = this.filterForm.value;
    this.jobSer.filterJobs(filterData).subscribe(
      (res: any) => {
        console.log('Filtered API Response:', res);
        this.jobList = res;
      },
      (error) => {
        console.error('Error fetching filtered jobs:', error);
      }
    );
  }

  toggleFilters() {
    this.showFilters = !this.showFilters; // Toggle filter visibility
  }

  openJob(id: number) {
    this.router.navigate(['/job-detail', id]);
  }
}




























