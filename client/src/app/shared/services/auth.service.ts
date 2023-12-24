import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import 'tslib';

import { Application, ApplicationResponse, User } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}



  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/login', user).pipe(
      tap(({ token }) => {
        localStorage.setItem('auth-token', token);
        this.setToken(token);
      })
    );
  }

  setToken(token: string | null): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
  // logout(): void {
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.setToken(null);
  //       localStorage.clear();
  //     }
  //   });
  // }

  // openLogoutConfirmationDialog(): void {
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.setToken(null);
  //       localStorage.clear();
  //       this.router.navigate(['/']);
  //     }
  //   });
  // }
}
