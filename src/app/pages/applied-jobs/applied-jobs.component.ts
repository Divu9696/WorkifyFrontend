import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/service/job.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-applied-jobs',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './applied-jobs.component.html',
  styleUrls: ['./applied-jobs.component.css']
})
export class AppliedJobsComponent implements OnInit {
  jobSeekerId: number = parseInt(localStorage.getItem('jobSeekerId') || '0', 10);
  appliedJobs: any[] = [];
  displayedColumns: string[] = ['jobTitle', 'companyName', 'status', 'appliedAt','resumeLink'];
  chart: any;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    if (this.jobSeekerId) {
      this.fetchAppliedJobs();
    }
  }

  // fetchAppliedJobs() {
  //   // Step 1: Fetch applications by jobSeekerId
  //   this.jobService.getApplicationsByJobSeekerId(this.jobSeekerId).subscribe({
  //     next: (applications: any[]) => {
  //       // Step 2: Fetch all job listings
  //       this.jobService.getJobListings().subscribe({
  //         next: (jobs: any[]) => {
  //           // Step 3: Merge data
  //           this.appliedJobs = applications.map(app => {
  //             const job = jobs.find(j => j.id === app.jobListingId);
  //             return {
  //               jobTitle: job?.title || 'Unknown',
  //               companyName: job?.companyName || 'Unknown',
  //               status: app.status,
  //               appliedAt: new Date(app.appliedAt).toLocaleString()
  //             };
  //           });
  //           // Generate Chart
  //           this.generateChart();
  //         }
  //       });
  //     }
  //   });
  // }
  fetchAppliedJobs() {
    this.jobService.getApplicationsByJobSeekerId(this.jobSeekerId).subscribe({
      next: (applications: any[]) => {
        // Fetch all job listings
        this.jobService.getJobListings().subscribe({
          next: (jobs: any[]) => {
            // Merge data
            this.appliedJobs = applications.map(app => {
              const job = jobs.find(j => j.id === app.jobListingId);
              return {
                jobTitle: job?.title || 'Unknown',
                companyName: job?.companyName || 'Unknown',
                status: app.status,
                appliedAt: new Date(app.appliedAt).toLocaleString(),
                resumeLink: app.resumePath ? 'http://localhost:7216/' + app.resumePath : null

                // resumeLink: app.resumePath || 'No resume available' // Include resume URL
              };
            });
            // Generate Chart
            this.generateChart();
          }
        });
      }
    });
  }
  

  generateChart() {
    const jobTitles = this.appliedJobs.map(job => job.jobTitle);
    const statuses = this.appliedJobs.map(job => job.status);

    this.chart = new Chart('appliedJobsChart', {
      type: 'bar',
      data: {
        labels: jobTitles,
        datasets: [
          {
            label: 'Application Status',
            data: statuses.map(status => (status === 'Pending' ? 1 : 0.5)),
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}