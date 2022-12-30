import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tables-data',
  templateUrl: './tables-data.component.html',
  styleUrls: ['./tables-data.component.css'],
})
export class TablesDataComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}
}
