import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducer, settingsFeatureKey } from 'src/app/core/store/settings/reducer/settings.reducer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    StoreModule.forFeature(settingsFeatureKey, reducer),
  ],
  declarations: [SettingsComponent],
})
export class SettingsModule { }
