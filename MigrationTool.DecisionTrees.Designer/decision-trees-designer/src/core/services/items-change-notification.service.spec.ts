import { TestBed } from '@angular/core/testing';

import { ItemsChangeNotificationService } from './items-change-notification.service';

describe('ItemsChangeNotificationService', () => {
  let service: ItemsChangeNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsChangeNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
