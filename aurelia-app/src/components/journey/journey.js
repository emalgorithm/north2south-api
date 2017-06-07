import {HttpClient} from 'aurelia-http-client';
import Dygraph from '../../../../node_modules/dygraphs/dist/dygraph';
import map from 'components/journey/map';
import io from '../../../../node_modules/socket.io-client/dist/socket.io';
var socket = io.connect();

export class Southpole {

  constructor() {
    this.client = new HttpClient()
      .configure(x => {
        x.withBaseUrl('/');
      });
    this.date = new Date();
  }

  activate(params) {
    this.id = params.id;
    /* Load data associated with id */
    this.client.get('journeys/' + this.id).then(function(response) {
      this.journey = JSON.parse(response.response);
    }.bind(this));
  }

  attached() {

    this.client.get('checkpoints').then(function (response) {
      var checkpoints = JSON.parse(response.response);
      this.dateAndHeartRates = checkpoints.map(c => [new Date(c.createdAt), c.heartRate])
      this.heartRateChart = this.chartHeartRate(this.dateAndHeartRates)
      this.calories = 0
      this.distance = 0
      if (checkpoints.length > 0) {
        this.calories = checkpoints[checkpoints.length - 1].calories || 0
        this.distance = checkpoints[checkpoints.length - 1].distance || 0
      }
      /* Initialise twitter feed */
    }.bind(this));

    socket.on('checkpoint:save',
      function (checkpoint) {
        Logger.info("Getting socket updates:  " + checkpoint)

        // Update chart real time
        this.dateAndHeartRates.push([new Date(checkpoint.createdAt), checkpoint.heartRate])
        this.heartRateChart.updateOptions( { 'file': this.dateAndHeartRates } );

        //Update other fields
        this.calories = checkpoint.calories
        this.distance = checkpoint.distance

        map.addMarker(checkpoint.latitude, checkpoint.longitude);
      }.bind(this));
    setup_twitter_feed()
    map.startMap()
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
    data = data.filter(d => d[0].toDateString() === this.date.toDateString())

    chart("calories", data)
    chart("distance", data)
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
