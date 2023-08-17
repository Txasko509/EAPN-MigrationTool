import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from '../interfaces/item';

@Injectable({
  providedIn: 'root'
})
export class CurrentItemChangeNotificationService {

  private currentItemChangedSubject : BehaviorSubject<Item|null>;
  public currentItemChanged$ : Observable<Item|null>;
  
  constructor() { 
    this.currentItemChangedSubject = new BehaviorSubject<Item|null>(null);
    this.currentItemChanged$ = this.currentItemChangedSubject.asObservable();
  }

  notifyChanges(item: Item){
    this.currentItemChangedSubject.next(item);    
  }

  reset(){
    this.currentItemChangedSubject = new BehaviorSubject<Item|null>(null);
    this.currentItemChanged$ = this.currentItemChangedSubject.asObservable();
  }
}