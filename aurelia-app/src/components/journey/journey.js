import {HttpClient} from 'aurelia-http-client';
import io from '../../../../node_modules/socket.io-client/dist/socket.io';
var socket = io.connect();
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import Dygraph from '../../../node_modules/dygraphs/dist/dygraph'

@inject(EventAggregator)
export class Southpole {

  journey;
  heartRate;
  calories;
  distance;

  constructor(EventAggregator) {
    this.client = new HttpClient()
      .configure(x => {
        x.withBaseUrl('/');
      });
    this.date = new Date();

    // Create an event aggregate (pub-sub) and subscribe to the event of when the map loads, so we can add marks
    // after that
    this.eventAggregator = EventAggregator;
  }

  activate(params) {
    this.url = window.location.href;
    this.id = params.id;
    /* Load data associated with id */
    this.client.get('journeys/' + this.id).then(function(response) {
      this.journey = JSON.parse(response.response);
      console.log(JSON.stringify(this.journey.checkpoints))
    }.bind(this));

  }

  attached() {
    this.eventAggregator.subscribeOnce("mapLoaded", this.onMapLoaded());

    this.plotCharts(this.journey.checkpoints)

    Logger.info("Inside journey attached(), the map is: ");
    this.map = this.component.currentViewModel;

    socket.on('checkpoint:save',
      function (checkpoint) {
        Logger.info("Getting socket updates:  " + checkpoint)

        //Update other fields
        this.totalCalories = checkpoint.calories
        this.totalDistance = checkpoint.distance

        //this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
      }.bind(this));

    setup_twitter_feed()
  }

  onMapLoaded() {
    return (function() {
      this.journey.checkpoints.forEach(function (checkpoint) {
        this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
      }.bind(this))
    }.bind(this));
  }

  plotCharts(checkpoints) {
    this.heartRate = checkpoints.map(function(a) {return a.createdAt.substring(0, 10)+","+a.heartRate+"\n";})
    this.calories = checkpoints.map(function(a) {return a.createdAt.substring(0, 10)+","+a.calories+"\n";})
    this.distance = checkpoints.map(function(a) {return a.createdAt.substring(0, 10)+","+a.distance+"\n";})

    new Dygraph(
      document.getElementById("heartRate"),
      "Date,HeartRate\n" + this.heartRate.join(""),
      {
        legend: 'always',
        labels: ["Time", "HeartRate"],
        //title: chartName,
      });
    new Dygraph(
      document.getElementById("distance"),
      "Date,Distance\n" + this.distance.join(""),
      {
        legend: 'always',
        labels: ["Time", "Distance"],
        //title: chartName,
      });
    new Dygraph(
      document.getElementById("calories"),
      "Date,Calories\n" + this.heartRate.join(""),
      {
        legend: 'always',
        labels: ["Time", "Calories"],
        //title: chartName,
      });
  }

}

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
