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
      chartHeartRate(this.checkpoints)
    }.bind(this));
  }

  activate() {
    socket.on('checkpoint:save',   // <- only works once (when loading the page) but doesn't listen after
      function (checkpoint) {
        console.log("Getting socket updates")
        this.checkpoints.push(checkpoint)
        chartHeartRate(this.checkpoints)
      }.bind( this ) );
  }
}

var chartHeartRate = function (checkpoints) {
  var data = checkpoints.map(c => [new Date(c.createdAt), c.heartRate])
  console.log(data)
  var g = new Dygraph(document.getElementById("chart"),
    data,
    {
      legend: 'always',
      xlabel: "Time",
      labels: [ "Time", "HeartRate"],
      //title: 'HeartRate',
      //showRoller: true,
      ylabel: 'Temperature (F)',
    });

  // window.intervalId = setInterval(function() {
  //   var x = new Date();  // current time
  //   var y = Math.random() * 150;
  //   data.push([x, y]);
  //   g.updateOptions( { 'file': data } );
  // }, 1000);
}
