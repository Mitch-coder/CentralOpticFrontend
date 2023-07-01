import { Component, Input, ViewChild } from '@angular/core';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-polar-area-chart',
  templateUrl: './polar-area-chart.component.html',
  styleUrls: ['./polar-area-chart.component.css']
})
export class PolarAreaChartComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  // PolarArea
  public polarAreaChartLabels: string[] = [ 'Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales' ];
  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: this.polarAreaChartLabels,
    datasets: [ {
      data: [ 300, 500, 100, 40, 120 ],
      label: 'Series 1',
      borderColor: ['rgba(215, 188, 230, 0.9)', 'rgba(213, 197, 240, 0.9)', 'rgba(192, 188, 217, 0.9)', 'rgba(194, 199, 240, 0.9)', 'rgba(179, 197, 229, 0.9)'], // Cambiar los colores de contorno
      backgroundColor: ['rgba(215, 188, 230, 0.5)', 'rgba(213, 197, 240, 0.5)', 'rgba(192, 188, 217, 0.5)', 'rgba(194, 199, 240, 0.5)', 'rgba(179, 197, 229, 0.5)'],
    } ]
  };
  public polarAreaLegend = true;

  public polarAreaChartType: ChartType = 'polarArea';

  @Input() set data(count:number[]) {

    if(count.length!==0){
      //console.log(data)
      console.log("Barras")
      this.polarAreaChartData.datasets[0].data = count;
      this.chart?.update();
    }

  }

  @Input() set labels(labels:string[]) {

    if(labels.length!==0){
      //console.log(data)
      console.log("Barras")
      this.polarAreaChartData.labels = labels;
      this.chart?.update();
    }

  }

  @Input() set title(title:string) {
      //console.log(data)
      console.log("Barras")
      this.polarAreaChartData.datasets[0].label = title;
      this.chart?.update();
  }


  // events
  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
