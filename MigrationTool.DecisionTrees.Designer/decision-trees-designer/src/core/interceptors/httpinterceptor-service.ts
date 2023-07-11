import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { SpinnerService } from "../services/spinner.service";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(public router: Router, private spinnerService: SpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        this.spinnerService.display(false);
        if(error.status === 401){
          this.router.navigateByUrl(`${'unauthorized'}`); 
        }else{
          this.router.navigateByUrl(`${'error'}`); 
        }        
        console.error("error is intercept", error);
        return throwError(error.message);
      })
    );
  }
}