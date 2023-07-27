import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/core/auth/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  logInForm!: FormGroup;

  hidePassword: boolean;
  showMatProgress: boolean;

  constructor(private fb: FormBuilder, private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private authService: AuthService) {
    this.hidePassword = true;
    this.showMatProgress = false;
  }

  ngOnInit(): void {
    let accessData = this.storage.get('access-data');

    this.logInForm = this.fb.group({
      email: new FormControl(accessData ? accessData.email : '', [
        Validators.required, Validators.maxLength(100)
      ]),
      password: new FormControl(accessData ? accessData.password : '', [
        Validators.required, Validators.maxLength(20)
      ]),
      rememberMe: new FormControl(accessData ? accessData.rememberMe : false, [
      ])
    });
  }

  onSubmit() {
    if (this.logInForm.valid) {
      this.showMatProgress = true;

      let email = this.logInForm.get("email")?.value;
      let password = this.logInForm.get("password")?.value;
      let rememberMe = this.logInForm.get("rememberMe")?.value;      

      this.authService.login(email, password).then((resp) => {
        this.showMatProgress = false;

        if (rememberMe) {
          this.storage.set('access-data', {
            email: email,
            password: password,
            rememberMe: true
          });
        }
        else {
          this.storage.set('access-data', null);
        }

        // get return url from query parameters or default to home page
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
          
      }).then(() => { }).
      catch(() => {
        this.showMatProgress = false;

        this.logInForm.get("password")?.setErrors({
          invalidDataAccess: this.translate.instant('AUTH.LOG-IN.ERROR-INVALID-DATA-ACCESS')
        });
      });
    }
  }
}
