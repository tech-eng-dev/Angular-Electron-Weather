import { Action, createReducer, on } from '@ngrx/store';
import { Settings } from 'src/app/core/models/settings.model';
import * as SettingsActions from '../action/settings.actions';

export const settingsFeatureKey = 'settings';

export interface SettingsState {
  settings: Settings;
}

export const initialState: SettingsState = {
  settings: null
};


export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.updateSettings,
      (state: SettingsState, {settings}) => ({...state, settings}))
);

export function reducer(state: SettingsState | null, action: Action): any {
  return settingsReducer(state, action);
}
