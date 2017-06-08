import {HttpClient} from 'aurelia-http-client';
import io from '../../../../node_modules/socket.io-client/dist/socket.io';
var socket = io.connect();
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import Dygraph from '../../../node_modules/dygraphs/dist/dygraph'

@inject(EventAggregator)
export class Southpole {

  journey;

  constructor(EventAggregator) {
    this.client = new HttpClient()
      .configure(x => {
        x.withBaseUrl('/');
      });
    this.date = new Date();
    this.checkpoints = [];
    this.distance = 0;

    // Create an event aggregate (pub-sub) and subscribe to the event of when the map loads, so we can add marks
    // after that
    this.eventAggregator = EventAggregator;
    this.eventAggregator.subscribeOnce("mapLoaded", this.onMapLoaded());
  }

  activate(params) {
    this.url = window.location.href;
    this.id = params.id;
    /* Load data associated with id */
    this.client.get('journeys/' + this.id).then(function(response) {
      this.journey = JSON.parse(response.response);
    }.bind(this));

  }

  attached() {
    Logger.info("Inside journey attached(), the map is: ");
    this.map = this.component.currentViewModel;
    this.caloriesChart = this.caloriesComponent.currentViewModel;
    console.log(this.map);

    socket.on('checkpoint:save',
      function (checkpoint) {
        Logger.info("Getting socket updates:  " + checkpoint);

        //Update other fields
        this.calories = checkpoint.calories;
        this.distance = checkpoint.distance;

        // Update chart real time
        this.dateAndHeartRates.push([new Date(checkpoint.createdAt), checkpoint.heartRate])
        this.heartRateChart.updateOptions( { 'file': this.dateAndHeartRates } );

        this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
      }.bind(this));

    setup_twitter_feed()
  }

  onMapLoaded() {
    return (function() {
      this.client.get('checkpoints').then(function (response) {
        this.checkpoints = JSON.parse(response.response);
        this.dateAndHeartRates = this.checkpoints.map(c => [new Date(c.createdAt), c.heartRate])
        console.log(this.dateAndHeartRates)
        this.heartRateChart = this.chartHeartRate(this.dateAndHeartRates)
        Logger.info("Received checkpoints from server");
        this.checkpoints.forEach(function (checkpoint) {
          if (checkpoint.distance && checkpoint.calories) {
            this.distance = checkpoint.distance;
            this.calories = checkpoint.calories;
          }

          this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
        }.bind(this))


      }.bind(this));
    }.bind(this));
  }

  nextDay() {
    this.date.setDate(this.date.getDate()+1);
    this.chartHeartRate(this.dateAndHeartRates)
    console.log("Day displayed is now " + this.date.toDateString())
  }

  previousDay() {
    this.date.setDate(this.date.getDate()-1);
    this.chartHeartRate(this.dateAndHeartRates)
    console.log("Day displayed is now " + this.date.toDateString())
  }

  chartHeartRate = function (data) {
    if (data <= 0) return;

    data = data.filter(d => d[0].toDateString() === this.date.toDateString())

    return chart("heartRate", data)
  }
}

let chart = function (chartName, data) {
  return new Dygraph(
    document.getElementById(chartName),
    data,
    {
      legend: 'always',
      labels: ["Time", chartName],
      //title: chartName,
    });
};

let setup_twitter_feed = function() {
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
