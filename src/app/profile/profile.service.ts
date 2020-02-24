import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Profile } from './profile.model';
import { map } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class ProfileService {
  private profile: Profile[] = [];
  private profileUpdated = new Subject<Profile[]>();
  private profileurl = 'http://localhost:3000/api/profile';
  constructor(private http: HttpClient) {}
  getProfile() {
    this.http.get<{ message: string; profile: any }>(this.profileurl)
      .pipe(map((profileData) => {
        return profileData.profile.map(profile => {
          return {
            email: profile.email,
            username: profile.username,
            password: profile.password,
            token: profile.token
          };
        });
      }))
      .subscribe(transformedProfile => {
        this.profile = transformedProfile;
        this.profileUpdated.next([...this.profile]);
      });
  }
  getProfileUpdateListener() {
    return this.profileUpdated.asObservable();
  }
  getUsername(username: string) {
    return {...this.profile.find(p => p.username)};
  }
}
