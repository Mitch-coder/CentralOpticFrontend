import { Component, Input, ViewChild  } from '@angular/core';

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { tap } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {

  SourceData:any[] = []

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 5
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    },
    elements: {
      bar: {
        backgroundColor: [
          'rgba(99, 107, 224, 0.5)', // Color personalizado para la primera barra
        ]
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'> = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40, 65, 59, 80 ], label: 'Series A' }
    ]
  };

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  @Input() set data(count:number[]) {

    if(count.length!==0){
      //console.log(data)
      console.log("Barras")
      this.barChartData.datasets[0].data = count;
      this.chart?.update();
    }

  }

  @Input() set labels(labels:string[]) {

    if(labels.length!==0){
      //console.log(data)
      console.log("Barras")
      this.barChartData.labels = labels;
      this.chart?.update();
    }

  }

  @Input() set title(title:string) {
      //console.log(data)
      console.log("Barras")
      this.barChartData.datasets[0].label = title;
      this.chart?.update();
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40 ];

    console.log(this.SourceData);

    this.chart?.update();
  }

}
