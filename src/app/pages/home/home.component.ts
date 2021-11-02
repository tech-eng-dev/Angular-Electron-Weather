import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { SocialUser } from 'angularx-social-login';
import { Observable, Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { ErrorStateMatcherHelperSerivce } from 'src/app/core/helpers/error-state-matcher-helper.service';
import { SessionUserHelperService } from 'src/app/core/helpers/session-user-helper.service';
import { Settings } from 'src/app/core/models/settings.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { DbService } from 'src/app/core/services/db.service';
import { SettingsState } from 'src/app/core/store/settings/reducer/settings.reducer';
import { selectSettings } from 'src/app/core/store/settings/selector/settings.selectors';
import { AxiosRequestConfig } from "axios";
import { WeatherApiService } from 'src/app/core/services/weather-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  country = new FormControl('', [
    Validators.required,
  ]);
  city = new FormControl('', [
    Validators.required,
  ]);
  matcher = new ErrorStateMatcherHelperSerivce();
  
  authorized$ = this.sessionUserHelper.authorized$;
  processingAuth: boolean = false;
  processingSearch: boolean = false;
  searchForm: FormGroup;
  settings$: Observable<Settings>;
  weather: any;
  private destroySub = new Subject<void>();

  constructor(
    private sessionUserHelper: SessionUserHelperService,
    private authService: AuthService,
    private weatherApiService: WeatherApiService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private store: Store<SettingsState>,
    private dbService: DbService
  ) {
  }

  ngOnInit() {
    this.authService.getAuthState().pipe(
      takeUntil(this.destroySub)
    ).subscribe((user: SocialUser) => {
      this.sessionUserHelper.setUserInfo(user);
      if (user?.email) {
        this.dbService.getUser(user).pipe(
          take(1)
        ).subscribe(res => {
          if (!res?.length) {
            this.dbService.addUser(user).pipe(
              take(1)
            ).subscribe(() => {});
          }
        });
      }
    });
    this.createForm();
    this.settings$ = this.store.pipe(select(selectSettings));
  }

  ngOnDestroy(): void {
    this.destroySub.next();
    this.destroySub.complete();
  }

  login() {
    this.processingAuth = true;
    this.authService.loginWithOAuth().pipe(
      finalize(() => (this.processingAuth = false)),
      take(1),
    ).subscribe();
  }

  logout() {
    this.processingAuth = true;
    this.authService.logoutOAuth().pipe(
      finalize(() => {
        this.processingAuth = false;
        this.sessionUserHelper.clearUserSession();
        this.showNotification('center', 'bottom', `You have been successfully logged out`, null, 2000);
      }),
      take(1),
    ).subscribe();
  }

  onSearch() {
    this.settings$.pipe(
      take(1)
    ).subscribe((settings : Settings) => {
      const options: AxiosRequestConfig = {
        params: {
          q: `${this.searchForm.get('city').value},${this.searchForm.get('country').value}`,
          mode: 'json'
        },
        headers: {
          'x-rapidapi-host': settings?.host,
          'x-rapidapi-key': settings?.key
        }
      };
      this.weather = null;
      this.processingSearch = true;
      this.weatherApiService.getWeather(settings?.url, options)
        .then(weather => {
          this.weather = weather?.data;
        })
        .catch(error => {
          this.showNotification('center', 'bottom', `${error?.response?.data?.message}`, 'OK');
        })
        .finally(() => {
          this.processingSearch = false;
        });
    });
  }

  private createForm() {
    this.searchForm = this.fb.group({
      country: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });
  }

  private showNotification(horizontalPosition: MatSnackBarHorizontalPosition = 'center', verticalPosition: MatSnackBarVerticalPosition = 'bottom', message: string, action: string = null, duration: number = null) {
    this.snackBar.open(message, action, {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: duration
    });
  }

}
