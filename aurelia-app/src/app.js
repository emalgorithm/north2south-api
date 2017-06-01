import {HttpClient} from 'aurelia-http-client';
import Dygraph from '../node_modules/dygraphs/dist/dygraph';
import io from '../node_modules/socket.io-client/dist/socket.io';
var socket = io.connect();


export class App {

  constructor() {
    this.heading = "Checkpoints";

    let client = new HttpClient()
      .configure(x => {
        x.withBaseUrl('/');
      });

    client.get('checkpoints').then(function (response) {
      this.checkpoints = JSON.parse(response.response);
      this.heartRateChart = chartHeartRate(this.checkpoints)
      this.calories = 0
      this.distance = 0
      if (this.checkpoints.length > 0) {
        this.calories = this.checkpoints.last.calories || 0
        this.distance = this.checkpoints.last.distance || 0
      }

    }.bind(this));
  }

  activate() {
    socket.on('checkpoint:save',
      function (checkpoint) {
        console.log("Getting socket updates:  " + checkpoint)
        this.checkpoints.push(checkpoint)
        updateChart(this.heartRateChart, this.checkpoints)
        this.calories = checkpoint.calories
        this.distance = checkpoint.distance
      }.bind( this ) );
  }
}

var chartHeartRate = function (checkpoints) {
  var data = checkpoints.map(c => [new Date(c.createdAt), c.heartRate])
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

var updateChart = function (chart, checkpoints) {
  var data = checkpoints.map(c => [new Date(c.createdAt), c[chart]])
  chart.updateOptions( { 'file': data } );
}
