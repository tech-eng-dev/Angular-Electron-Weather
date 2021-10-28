import { Injectable } from '@angular/core';
import { StorageKeys } from '../enums/storage-keys.enum';
import { getSerializedModel, getDeserializedModel } from 'src/app/utils/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocialUser } from 'angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class SessionUserHelperService {
  private userInfoSubject: BehaviorSubject<SocialUser> = new BehaviorSubject(
    getDeserializedModel(sessionStorage.getItem(StorageKeys.userInfo))
  );
  userInfo$: Observable<SocialUser> = this.userInfoSubject.asObservable();
  authorized$: Observable<boolean> = this.userInfo$.pipe(map(userInfo => !!userInfo && !!userInfo.authToken));

  constructor() {}

  isAuthorized(): boolean {
    return !!this.userInfoSubject.getValue();
  }

  setUserInfo(userInfo: SocialUser) {
    sessionStorage.setItem(StorageKeys.userInfo, getSerializedModel(userInfo));
    this.userInfoSubject.next(userInfo);
  }

  getUserInfo(): SocialUser {
    const serializedUserInfo = sessionStorage.getItem(StorageKeys.userInfo);
    return serializedUserInfo && getDeserializedModel(serializedUserInfo);
  }

  clearUserSession() {
    sessionStorage.setItem(StorageKeys.userInfo, null);
    this.userInfoSubject.next(null);
  }

}
