import 'bootstrap'
import 'material-dashboard'
import Chartist from 'chartist'
import { EventAggregator } from 'aurelia-event-aggregator'
import { RestApi } from 'services/api'

export class Journey {

  static inject = [RestApi, EventAggregator]

  constructor(api, eventAggregator) {
    Object.assign(this, { api, eventAggregator })

    this.eventAggregator.subscribeOnce("mapLoaded", this.onMapLoaded())
  }

  activate(params, routerConfig) {
    return this.api.getJourney(params.id).then(journey =>
      Object.assign(this, ...journey))
  }

  get shortDescription() {
    if (this.description.length > 500)
      return this.description.substr(0, 500 - '...'.length) + '...'
    return this.description
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

  onMapLoaded() {
    // TODO: draw markers for checkpoints
    // TODO: subscribe for real-time updates
    return () => {}
  }
}