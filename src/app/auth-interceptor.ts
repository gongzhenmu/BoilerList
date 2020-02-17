import {HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {MainComponent} from './common/main/main.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private mainComponent: MainComponent) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.mainComponent.getToken();
    const authRequest = req.clone({
      // headers: new HttpHeaders({'Content-Type':  'application/json',
      //   'Authorization': authToken})
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
