import 'bootstrap'
import 'material-dashboard'
import Chartist from 'chartist'
import { EventAggregator } from 'aurelia-event-aggregator'
import { RestApi } from 'services/api'
import { WeatherApi } from 'services/weatherApi'
import io from 'socket.io'
var socket = io.connect();

export class Journey {

  static inject = [RestApi, WeatherApi, EventAggregator]

  constructor(api, weatherApi, eventAggregator) {
    Object.assign(this, { api, weatherApi, eventAggregator })
    this.checkpoints = [];
    this.destination = {
      "latitude" : 0,
      "longitude": 0
    };
    this.mapLoaded = false;
    this.eventAggregator.subscribeOnce("mapLoaded", map => {
      this.mapLoaded = true;
      this.map = map;
      // Case 1: HTTP response has loaded first, and now map is loaded and we draw checkpoints
      this.addPointsToMap();
      console.log("Weather: ");
      console.log(this.weather);
    });
  }

  activate(params, routeConfig) {
    socket.on('checkpoint:save', checkpoint => this.onNewCheckpoint(checkpoint));

    return this.api.getJourney(params.id).then(journey => {
        Object.assign(this, ...journey);
        this.weatherApi.getCurrentWeather(this.latestCheckpoint.latitude, this.latestCheckpoint.longitude).then(weather => this.weather = weather);
      // Case 2: Map has loaded first, and now we get checkpoints from HTTP request and we draw checkpoints
        if (this.mapLoaded) {
          this.addPointsToMap();
        }
      }
    )
  }

  get shortDescription() {
    if (this.description.length > 500)
      return this.description.substr(0, 500 - '...'.length) + '...'
    return this.description
  }

  addPointsToMap() {
    this.map.addDestination(this.destination.latitude, this.destination.longitude);
    this.checkpoints.forEach(function (checkpoint) {
      this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
    }.bind(this));
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
    this.setup_twitter_feed()
  }

  onNewCheckpoint(checkpoint) {
    console.log("Getting socket updates:  " + checkpoint);

    //Update other fields
    this.calories = checkpoint.calories;
    this.distance = checkpoint.distance;

    if (this.mapLoaded) {
      this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
    }
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
  }


}
