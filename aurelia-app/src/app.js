import {HttpClient} from 'aurelia-http-client';
import Dygraph from '../node_modules/dygraphs/dist/dygraph';
import io from '../node_modules/socket.io-client/dist/socket.io';
var socket = io.connect();


export class App {

  constructor() {
    this.heading = "NorthToSouth";

    let client = new HttpClient()
      .configure(x => {
        x.withBaseUrl('/');
      });

    client.get('checkpoints').then(function (response) {
      var checkpoints = JSON.parse(response.response);
      this.dateAndHeartRates = checkpoints.map(c => [new Date(c.createdAt), c.heartRate])
      console.log(this.dateAndHeartRates)
      this.heartRateChart = chartHeartRate(this.dateAndHeartRates)
      this.calories = 0
      this.distance = 0
      if (checkpoints.length > 0) {
        this.calories = checkpoints[checkpoints.length - 1].calories || 0
        this.distance = checkpoints[checkpoints.length - 1].distance || 0
      }

    }.bind(this));
  }

  activate() {
    socket.on('checkpoint:save',
      function (checkpoint) {
        console.log("Getting socket updates:  " + checkpoint)

        // Update chart real time
        this.dateAndHeartRates.push([new Date(checkpoint.createdAt), checkpoint.heartRate])
        this.heartRateChart.updateOptions( { 'file': this.dateAndHeartRates } );

        //Update other fields
        this.calories = checkpoint.calories
        this.distance = checkpoint.distance

      }.bind( this ) );
  }
}

var chartHeartRate = function (data) {
  chart("calories", data)
  chart("distance", data)
  return chart("heartRate", data)
}

var chart = function (chartName, data) {
  return new Dygraph(
    document.getElementById(chartName),
    data,
    {
      legend: 'always',
      labels: ["Time", chartName],
      //title: chartName,
    });
}
