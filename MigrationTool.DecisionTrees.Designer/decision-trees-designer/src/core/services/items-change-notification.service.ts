import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from '../interfaces/item';

@Injectable({
  providedIn: 'root'
})
export class ItemsChangeNotificationService {

  private itemsChangedSubject : BehaviorSubject<Item[]>;
  public itemsChanged$ : Observable<Item[]>;
  
  constructor() { 
    this.itemsChangedSubject = new BehaviorSubject<Item[]>([]);
    this.itemsChanged$ = this.itemsChangedSubject.asObservable();
  }

  notifyChanges(items: Item[]){
    this.itemsChangedSubject.next(items);    
  }

  reset(){
    this.itemsChangedSubject = new BehaviorSubject<Item[]>([]);
    this.itemsChanged$ = this.itemsChangedSubject.asObservable();
  }
}
