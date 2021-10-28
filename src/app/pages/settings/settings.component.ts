import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { ErrorStateMatcherHelperSerivce } from 'src/app/core/helpers/error-state-matcher-helper.service';
import { Settings } from 'src/app/core/models/settings.model';
import { updateSettings } from 'src/app/core/store/settings/action/settings.actions';
import { SettingsState } from 'src/app/core/store/settings/reducer/settings.reducer';
import { selectSettings } from 'src/app/core/store/settings/selector/settings.selectors';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  url = new FormControl('', [
    Validators.required,
  ]);
  host = new FormControl('', [
    Validators.required,
  ]);
  key = new FormControl('', [
    Validators.required,
  ]);
  matcher = new ErrorStateMatcherHelperSerivce();
  settingsForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<SettingsState>
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.initSettings();
  }

  onSave() {
    const settings = {
      url: this.settingsForm.get('url').value,
      host: this.settingsForm.get('host').value,
      key: this.settingsForm.get('key').value
    }
    this.store.dispatch(updateSettings(settings));
    this.router.navigate(['/home']);
  }

  private initSettings() {
    const settings$ = this.store.pipe(select(selectSettings)).pipe(
      take(1)
    ).subscribe((settings: Settings) => {
      this.settingsForm.get('url').setValue(settings?.url);
      this.settingsForm.get('host').setValue(settings?.host);
      this.settingsForm.get('key').setValue(settings?.key);
    });
  }

  private createForm() {
    this.settingsForm = this.fb.group({
      url: ['', [Validators.required]],
      host: ['', [Validators.required]],
      key: ['', [Validators.required]],
    });
  }

}
