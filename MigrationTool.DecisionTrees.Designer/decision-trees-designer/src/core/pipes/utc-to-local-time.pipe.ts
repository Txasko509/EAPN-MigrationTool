import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'utcToLocalTime',
})
export class UtcToLocalTimePipe implements PipeTransform {
  transform(date: Date, args?: any): Date {
    if(date != null)
      return moment.utc(date).local().toDate();
    else return date;
  }
}