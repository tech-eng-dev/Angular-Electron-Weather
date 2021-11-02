import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ElectronService } from 'ngx-electron';
import { User } from '../models/user.model';
import { SocialUser } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private electronService: ElectronService
  ) {
  }

  getUser(user: SocialUser): Observable<User[]> {
    return of(this.electronService.ipcRenderer.sendSync('get-user', user)).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }

  addUser(user: User): Observable<boolean> {
    return of(this.electronService.ipcRenderer.sendSync('add-user', user)
    ).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }

  deleteUser(user: User): Observable<boolean> {
    return of(this.electronService.ipcRenderer.sendSync('delete-user', user)
    ).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }
}
