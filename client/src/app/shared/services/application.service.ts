import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'tslib';
import { Application, ApplicationResponse } from '../interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private token: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `${token}`);
  }
  createApplication(application: Application): Observable<ApplicationResponse> {
    return this.http.post<ApplicationResponse>('/api/application', application);
  }

  getApplications(): Observable<any> {
    return this.http.get('/api/application', {
      headers: this.getHeaders(),
    });
  }

  deleteApplication(applicationId: string, reason: string): Observable<any> {
    const headers = this.getHeaders();
    const body = { reason };
    const options = { headers, body };

    return this.http.delete(`/api/application/${applicationId}`, options);
  }
  acceptApplication(applicationId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`/api/application/${applicationId}`, {}, { headers });
  }
}
