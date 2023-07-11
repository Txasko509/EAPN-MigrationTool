import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DecisionTree } from '../interfaces/decision-tree';
import { Observable } from 'rxjs';
import { SearchParams } from '../interfaces/shared/search-params';
import { DatePipe } from '@angular/common';
import { AppConfigService } from 'src/app/app.config.service';

@Injectable({
  providedIn: 'root'
})
export class DecisionTreeService {

  constructor(private http: HttpClient, private configApp: AppConfigService, private datepipe: DatePipe) {
  }  

  search<DecisionTree>(fromDate: Date | null, toDate: Date | null, searchParams: SearchParams): Observable<DecisionTree[]> {
    let params = this.getParams(fromDate, toDate, searchParams);

    return this.http.get<DecisionTree[]>(this.configApp.apiEndpoint + "/api/decision-trees", { params });
  } 

  get<Study>(decisionTreeId: number): Observable<DecisionTree> {
    return this.http.get<DecisionTree>(this.configApp.apiEndpoint + "/api/decision-trees/" + decisionTreeId);
  }

  create(decisionTree: DecisionTree): Observable<any> {
    return this.http.post(this.configApp.apiEndpoint + '/api/decision-trees', decisionTree);
  }

  update(decisionTree : DecisionTree): Observable<any> {
    return this.http.put(this.configApp.apiEndpoint + "/api/decision-trees/" + decisionTree.id, decisionTree);
  }  

  remove(decisionTreeId : number): Observable<any> {
    return this.http.delete<any>(this.configApp.apiEndpoint + "/api/decision-trees/" + decisionTreeId);
  }

  getParams(fromDate: Date | null, toDate: Date | null, searchParams: SearchParams): HttpParams {
    let params = new HttpParams();

    if (fromDate !== null) {
      params = params.append('fromDate', this.datepipe.transform(fromDate, 'yyyy-MM-dd') ?? '');
    }
    
    if (toDate !== null) {
      params = params.append('toDate', this.datepipe.transform(toDate, 'yyyy-MM-dd') ?? '');
    }

    if (searchParams.sort !== null && searchParams.sort.active !== undefined) {
      params = params.append('sort', searchParams.sort.active + ' ' + searchParams.sort.direction);
    }

    if (searchParams.searchText !== null) params = params.append('searchText', searchParams?.searchText ?? '');

    return params;
  } 
}
