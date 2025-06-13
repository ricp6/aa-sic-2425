import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private readonly viewModeSubject = new BehaviorSubject<'client' | 'enterprise'>('client');
  viewMode$ = this.viewModeSubject.asObservable();

  setView(mode: 'client' | 'enterprise') {
    this.viewModeSubject.next(mode);
  }

  get currentView(): 'client' | 'enterprise' {
    return this.viewModeSubject.value;
  }
}
