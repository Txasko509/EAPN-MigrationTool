import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserInfo } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { AuthService } from 'src/core/auth/auth.service';
import { AppToasterService } from 'src/core/services/app-toaster.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  loadedUserProfile$: Observable<UserInfo>;

  fullName: string;
  constructor(private router: Router, private appToasterService: AppToasterService,
    public translate: TranslateService, private authService: AuthService) {
      this.isAuthenticated$ = authService.isAuthenticated$;
      this.isLoggedOut$ = authService.isLoggedOut$;
      this.loadedUserProfile$ = authService.loadedUserProfile$;
  
      this.fullName = "";
  }

  ngOnInit(): void {
    this.isLoggedOut$.subscribe(
      result => {
        if (result) {
          this.fullName = '';
        }
      });

  this.authService.loadedUserProfile$.subscribe(
    data => {
      if (data && data.info) {
        this.fullName = data?.info?.family_name;
      }
      else if (this.authService.hasValidToken()){
        this.authService.loadUserProfile();
      }
    });
  }

  onHomeClick() {
    this.router.navigateByUrl(`${'/home'}`);
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigateByUrl(`${'log-in'}`);
  }
}
