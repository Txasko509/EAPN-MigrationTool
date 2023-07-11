import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppToasterService } from 'src/core/services/app-toaster.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private appToasterService: AppToasterService,
    public translate: TranslateService) {
  }

  ngOnInit(): void {
  }

  onHomeClick() {
    this.router.navigateByUrl(`${'/home'}`);
  }
}
