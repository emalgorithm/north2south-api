import {HttpClient} from 'aurelia-http-client';
import io from '../../../../node_modules/socket.io-client/dist/socket.io';
var socket = io.connect();
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import Dygraph from '../../../node_modules/dygraphs/dist/dygraph'

@inject(EventAggregator)
export class Southpole {

  journey;
  heartRateGraph;
  caloriesGraph;
  distanceGraph;

  constructor(EventAggregator) {
    this.client = new HttpClient()
      .configure(x => {
        x.withBaseUrl('/');
      });
    this.date = new Date();

    // Create an event aggregate (pub-sub) and subscribe to the event of when the map loads, so we can add marks
    // after that
    this.eventAggregator = EventAggregator;
    this.eventAggregator.subscribeOnce("mapLoaded", this.onMapLoaded());
  }

  activate(params) {
    this.url = window.location.href;
    this.id = params.id;
    /* Load data associated with id */
  }

  attached() {
    //this.plotCharts(this.journey.checkpoints)

    Logger.info("Inside journey attached(), the map is: ");
    this.map = this.component.currentViewModel;

    socket.on('checkpoint:save',
      function (checkpoint) {
        Logger.info("Getting socket updates:  " + checkpoint)

        //Update other fields
        this.totalCalories = checkpoint.calories
        this.totalDistance = checkpoint.distance
        // Update charts real time
        this.heartRateGraph.push([new Date(checkpoint.createdAt), checkpoint.heartRate])
        this.heartRateGraph.updateOptions( { 'file': this.heartRateGraph } );

        this.distanceGraph.push([new Date(checkpoint.createdAt), checkpoint.distance])
        this.distanceGraph.updateOptions( { 'file': this.distanceGraph } );

        this.caloriesGraph.push([new Date(checkpoint.createdAt), checkpoint.calories])
        this.caloriesGraph.updateOptions( { 'file': this.caloriesGraph } );

        //this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
      }.bind(this));

    setup_twitter_feed()
  }

  onMapLoaded() {
    return (function() {
      this.client.get('journeys/' + this.id).then(function(response) {
        this.journey = JSON.parse(response.response);
        console.log(JSON.stringify(this.journey.checkpoints))
        this.journey.checkpoints.forEach(function (checkpoint) {
          this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
        }.bind(this));
      }.bind(this))
    }.bind(this));
  }

  plotCharts(checkpoints) {
    var heartRate = checkpoints.map(function(a) {return a.createdAt.substring(0, 10)+","+a.heartRate+"\n";})
    var calories = checkpoints.map(function(a) {return a.createdAt.substring(0, 10)+","+a.calories+"\n";})
    var distance = checkpoints.map(function(a) {return a.createdAt.substring(0, 10)+","+a.distance+"\n";})

    this.heartRateGraph = new Dygraph(
      document.getElementById("heartRate"),
      "Date,HeartRate\n" + heartRate.join(""),
      {
        legend: 'always',
        labels: ["Time", "HeartRate"],
        //title: chartName,
      });
    this.distanceGraph = new Dygraph(
      document.getElementById("distance"),
      "Date,Distance\n" + distance.join(""),
      {
        legend: 'always',
        labels: ["Time", "Distance"],
        //title: chartName,
      });
    this.caloriesGraph = new Dygraph(
      document.getElementById("calories"),
      "Date,Calories\n" + calories.join(""),
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
