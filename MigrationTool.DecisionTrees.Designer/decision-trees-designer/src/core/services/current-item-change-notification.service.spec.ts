import { TestBed } from '@angular/core/testing';

import { CurrentItemChangeNotificationService } from './current-item-change-notification.service';

describe('CurrentItemChangeNotificationService', () => {
  let service: CurrentItemChangeNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentItemChangeNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
