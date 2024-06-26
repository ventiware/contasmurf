import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'token';
  private jwtHelper: JwtHelperService;

  constructor(private http: HttpClient, private router: Router) {
    this.jwtHelper = new JwtHelperService();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      const tokenData = this.parseJwt(token);
      return tokenData && tokenData.exp && tokenData.exp > Date.now() / 1000;
    }
    return false;
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('Login Response:', response);
        const token = response.token;
        this.setToken(token);
      })
    );
  }

  logoutIfTokenExpired(): void {
    const token = localStorage.getItem('token');
    if (token && this.jwtHelper.isTokenExpired(token)) {
      // Token expirado, realizar logout
      this.logout();
    }
  }

  logout(): void {
    // Limpar token e redirecionar para a página de login
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (token) {
      const tokenData = this.parseJwt(token);
      return tokenData && tokenData.exp && tokenData.exp > Date.now() / 1000;
    }
    return false;
  }

  parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}