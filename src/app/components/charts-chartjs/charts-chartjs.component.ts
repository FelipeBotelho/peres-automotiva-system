import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-charts-chartjs',
  templateUrl: './charts-chartjs.component.html',
  styleUrls: ['./charts-chartjs.component.css'],
})
export class ChartsChartjsComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}
}
