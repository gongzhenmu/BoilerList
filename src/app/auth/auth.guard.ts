import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
  ): boolean{
    if (!this.authService.getIsAuth()) {
      this.router.navigate(['/login']);
    }
    return this.authService.getIsAuth();
  }
}
