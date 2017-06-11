import 'bootstrap'
import 'material-dashboard'
import Chartist from 'chartist'

export class App {
  constructor() {
  }

  attached() {
    var data = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [85, 78, 76, 72, 88, 79, 82]
      ]
    };

    var options = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 60,
        high: 90,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    };

    var chart = new Chartist.Line('.heart-rate-chart', data, options);

    md.startAnimationForLineChart(chart);

    data = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [2585, 2895, 2965, 3072, 2512, 3125, 2454]
      ]
    };

    options = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 2000,
        high: 3500,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    };

    chart = new Chartist.Line('.calories-chart', data, options);

    md.startAnimationForLineChart(chart);
  }
}