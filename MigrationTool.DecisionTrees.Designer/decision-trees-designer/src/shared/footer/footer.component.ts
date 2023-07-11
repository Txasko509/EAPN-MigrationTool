import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear: number;
  currentVersion: string;

  constructor() { 
    this.currentYear = new Date().getFullYear();
    this.currentVersion = "v1.0.0";
  }

  ngOnInit(): void {
  }

}
