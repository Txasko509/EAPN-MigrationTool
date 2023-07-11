import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) { }

  onStudy1Click() {   
    // Redirect to
    //this.router.navigateByUrl(`${'studies'}`, { state: {data: StudyType.MesofillerUi} });    
  }

  onStudy2Click() {
    // Redirect to
    //this.router.navigateByUrl(`${'studies'}`, { state: { data: StudyType.MesofillerLaserUi } });
  }

  onStudy3Click() {
    // Redirect to
    //this.router.navigateByUrl(`${'studies'}`, { state: { data: StudyType.MesofillerLaserAv } });
  }
}
