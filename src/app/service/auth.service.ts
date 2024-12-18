import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiEndPoint: string = 'http://localhost:7216/api/';
  jwtHelper = new JwtHelperService(); // Instantiating JwtHelperService directly
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkLoginStatus();
  }

  // Login user and store token
  login(credentials: any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Auth/login', credentials);
  }

  // Check if the user is logged in
  private checkLoginStatus() {
    const userData = localStorage.getItem('jobLoginUser');
    if (userData) {
      this.loggedInSubject.next(true);
    }
  }

  // Logout user and clear session
  logout() {
    localStorage.removeItem('jobLoginUser');
    this.loggedInSubject.next(false);
    this.router.navigateByUrl('/login'); // Redirect to login page after logout
  }

  // Get user info from local storage
  getUserInfo() {
    const userData = localStorage.getItem('jobLoginUser');
    return userData ? JSON.parse(userData) : null;
  }

  // Check if the user is an employer
  isEmployer(): boolean {
    const user = this.getUserInfo();
    return user && user.role === 'Employer';
  }

  // Check if the user is a job seeker
  isJobSeeker(): boolean {
    const user = this.getUserInfo();
    return user && user.role === 'JobSeeker';
  }

  // Check if the token is expired
  // isTokenExpired(): boolean {
  //   const token = this.getUserInfo()?.token;
  //   return token ? this.jwtHelper.isTokenExpired(token) : true;
  // }
}
