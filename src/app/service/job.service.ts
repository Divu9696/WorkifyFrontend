import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class JobService {
  apiEndPoint: string = 'http://localhost:7216/api/';
  jwtHelper = new JwtHelperService(); // Instantiating JwtHelperService directly

  // private loggedInSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }

// Register a new user
registerUser(obj: any): Observable<any> {
  return this.http.post(this.apiEndPoint + 'User/register', obj); 
}

  // Login user
  // login(obj: any) {
  //   return this.http.post(this.apiEndPoint + 'Auth/login', obj);
  // }

 // Fetch active job listings
 GetActiveJobs() {
  return this.http.get(this.apiEndPoint + 'JobListing');
}

  // Fetch applications by job seeker ID
  getApplicationsByJobSeekerId(jobSeekerId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiEndPoint + 'Application/jobseeker/' + jobSeekerId);
  }

  // Add company
  addCompany(company: any): Observable<any> {
    return this.http.post<any>(`${this.apiEndPoint }Employer`, company);
  }

  // Post a job
  postJob(job: any): Observable<any> {
    return this.http.post<any>(`${this.apiEndPoint }Joblisting`, job);
  }

  // Fetch all employers
  getEmployers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiEndPoint }Employer`);
  }

  GetJobsByEmployerId(employerid : number) {
    return this.http.get(this.apiEndPoint + 'JobListing/employer/'+ employerid)
  }
  GetApplicationsByJobId(jobListingId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiEndPoint}Application/joblisting/${jobListingId}`);
  }
  
 
  GetJobListingById(jobid: number) {
    return this.http.get(this.apiEndPoint + 'JobListing/' + jobid)
  }

   // Create a new Job Seeker
   CreateJobSeeker(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiEndPoint + 'JobSeeker', formData);
  }
  updateJobSeekerProfile(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiEndPoint}JobSeeker/${id}`, formData);
  }

  getResumeByJobSeekerId(jobSeekerId: number): Observable<any> {
    return this.http.get(`${this.apiEndPoint}JobSeeker/${jobSeekerId}/resume`, { responseType: 'blob' });
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<any> {
    const url = `http://localhost:7216/api/Application/${applicationId}`;
    const body = { status };  // status will be passed as part of an object
    return this.http.put(url, body, { headers: { 'Content-Type': 'application/json' } });
  }
  
  
  
  

  filterJobs(filterData: any): Observable<any> {
    // Create a filtered object to include only non-empty fields
    const params: any = {};
    
    // Only add the keys that have non-empty values
    if (filterData.title) params.title = filterData.title;
    if (filterData.location) params.location = filterData.location;
    if (filterData.minSalary) params.minSalary = filterData.minSalary;
    if (filterData.jobType) params.jobType = filterData.jobType;
    if (filterData.skills) params.skills = filterData.skills;
  
    // Send the request with only the filled parameters
    return this.http.get<any>(this.apiEndPoint + 'JobListing/filter', { params });
  }


  // Fetch all Job Seekers
  GetJobSeekers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiEndPoint}JobSeeker`);
  }

    // Fetch job seeker by ID
    GetJobSeekerById(jobSeekerId: number): Observable<any> {
      return this.http.get<any>(`${this.apiEndPoint}JobSeeker/${jobSeekerId}`);
    }

  // Submit a job application
  CreateApplication(applicationData: any): Observable<any> {
    return this.http.post<any>(this.apiEndPoint + 'Application', applicationData);
  }

  saveJobSeekerIdToLocalStorage(jobSeekerId: number): void {
    localStorage.setItem('jobSeekerId', jobSeekerId.toString());
  }
  submitApplication(applicationData: any): Observable<any> {
    return this.http.post<any>(this.apiEndPoint+ 'Application',applicationData);
  }

  
  getJobSeekerIdFromLocalStorage(): number | null {
    const storedId = localStorage.getItem('jobSeekerId');
    return storedId ? parseInt(storedId, 10) : null;
  }
  clearJobSeekerIdFromLocalStorage(): void {
    localStorage.removeItem('jobSeekerId');
  }


   // Method to apply for a job
   applyForJob(applicationData: { jobSeekerId: number; jobListingId: number }): Observable<any> {
    return this.http.post(this.apiEndPoint +'Application', applicationData);
  }


  // getApplicationsByJobSeekerId(jobSeekerId: number): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/Application/jobseeker/${jobSeekerId}`);
  // }

  getJobListings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiEndPoint}JobListing`);
  }

  UpdateJob(id: number, jobData: any) {
    return this.http.put(`${this.apiEndPoint}JobListing/${id}`, jobData);
  }
  
  DeleteJob(jobId: number) {
    return this.http.delete(`${this.apiEndPoint}JobListing/${jobId}`);
  }
  // In job.service.ts
getJobRecommendations(jobSeekerId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiEndPoint}JobSeeker/recommendations/${jobSeekerId}`);
}


}