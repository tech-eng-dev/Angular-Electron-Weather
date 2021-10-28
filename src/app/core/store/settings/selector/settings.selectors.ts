import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromSettings from '../reducer/settings.reducer';

export const selectSettingsState = createFeatureSelector<fromSettings.SettingsState>(
  fromSettings.settingsFeatureKey,
);

export const selectSettings = createSelector(
  selectSettingsState,
  (state: fromSettings.SettingsState) => state?.settings
);
