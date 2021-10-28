import { createAction } from '@ngrx/store';
import { Settings } from 'src/app/core/models/settings.model';

export const updateSettings = createAction(
  '[Settings] Update Settings',
  (settings: Settings) => ({settings})
);




