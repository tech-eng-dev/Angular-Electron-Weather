import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from 'src/assets/model/user.schema';
import { ElectronService } from 'ngx-electron';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private electronService: ElectronService
  ) {
  }

  getUsers(): Observable<User[]> {
    return of(this.electronService.ipcRenderer.sendSync('get-users')).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }

  addUser(user: User): Observable<User[]> {
    return of(this.electronService.ipcRenderer.sendSync('add-user', user)
    ).pipe(catchError((error: any) => Observable.throw(error.json)));
  }

  deleteUser(user: User): Observable<User[]> {
    return of(this.electronService.ipcRenderer.sendSync('delete-user', user)
    ).pipe(catchError((error: any) => Observable.throw(error.json)));
  }
}