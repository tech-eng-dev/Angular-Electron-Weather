import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ElectronService } from 'ngx-electron';
import { Settings } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private electronService: ElectronService
  ) {
  }

  getSettings(settings: Settings): Observable<Settings[]> {
    return of(this.electronService.ipcRenderer.sendSync('get-settings', settings)).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }

  addSettings(settings: Settings): Observable<boolean> {
    return of(this.electronService.ipcRenderer.sendSync('add-settings', settings)
    ).pipe(
      catchError((error: any) => Observable.throw(error.json))
    );
  }

}
