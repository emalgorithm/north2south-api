import 'bootstrap'
import 'material-dashboard'
import Chartist from 'chartist'
import { EventAggregator } from 'aurelia-event-aggregator'
import { RestApi } from 'services/api'
import moment from 'moment'

export class Journey {

  static inject = [RestApi, EventAggregator]

  constructor(api, eventAggregator) {
    Object.assign(this, { api, eventAggregator })
    this.displayedDays = 7; /* For now */
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

  getGraphData(groups, field) {
    var dataAndDates = []
    for (var property in groups) {
      if (groups.hasOwnProperty(property)) {
        var data = groups[property].map(function(a) { return a[field]; })
        dataAndDates.push([property, data.reduce(function(a, b) {return a + b;}) / data.length]);
      }
    }

    var datelabels = []
    var dataSeries = []

    if (dataAndDates.length > 0) {
      datelabels.push(dataAndDates[0][0])
      dataSeries.push(dataAndDates[0][1])
      var current = 1;
      var lastDate = dataAndDates[0][0]
      for (var i = 1; i < this.displayedDays; i++) {
        if (current < dataAndDates.length && this.isNext(dataAndDates[current][0], lastDate)) {
          datelabels.push(dataAndDates[current][0])
          dataSeries.push(dataAndDates[current][1])
          lastDate = dataAndDates[current][0]
          current += 1
        } else {
          lastDate = moment(lastDate, 'MMM/DD', false).add(-1, 'days').format('MMM DD')
          datelabels.push(lastDate)
          dataSeries.push(undefined)
        }
      }
    } else {
      /* This week's days with no data */
      for (var i = this.displayedDays - 1; i >= 0; i--) {
        datelabels.push(moment().add(-i, 'days').format('MMM DD'))
      }
    }

    return {
      labels: datelabels,
      series: [dataSeries]
    };
  }
  attached() {
    var groups = this.checkpoints.reduce(function (cs, c) {
      (cs[moment(c.createdAt).format('MMM DD')] = cs[moment(c.createdAt).format('MMM DD')] || []).push(c);
      return cs;
    }, {});

    var heartRateData = this.getGraphData(groups, 'heartRate')

    var options = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 60,
        high: 90,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    };

    var chart = new Chartist.Line('.heart-rate-chart', heartRateData, options);

    md.startAnimationForLineChart(chart);

    var caloriesData = {
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

    chart = new Chartist.Line('.calories-chart', caloriesData, options);

    md.startAnimationForLineChart(chart);
    this.setup_twitter_feed()
  }

  isNext(d1, d2) {
    return moment(d2, 'MMM/DD', false).diff(moment(d1, 'MMM/DD', false), 'days') == 1
  }

  onMapLoaded() {
    // TODO: draw markers for checkpoints
    // TODO: subscribe for real-time updates
    return () => {}
  }

  setup_twitter_feed = function() {
  !function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      p = /^http:/.test(d.location) ? 'http' : 'https';
    if (!d.getElementById(id)) {
      js = d.createElement(s);
      js.id = id;
      js.src = p + "://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);
    }
  }(document, "script", "twitter-wjs");
};
}
