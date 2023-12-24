import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private applicationIdSource = new BehaviorSubject<string>('');
  currentApplicationId = this.applicationIdSource.asObservable();

  constructor() {}

  changeApplicationId(applicationId: string) {
    this.applicationIdSource.next(applicationId);
  }
}