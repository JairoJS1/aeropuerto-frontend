import { Location } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  @Input() title: string;
  @Input() msg: string;

  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  regresar(){
    this.location.back();
  }

  reload(){
    location.reload();
  }
}
