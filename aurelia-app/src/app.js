// import {io} from 'socket.io-client';
// var socket = io.connect('http://localhost:9000');
//
// export class App {
//   activate() {
//     socket.on('checkpoints',   // <- only works once (when loading the page) but doesn't listen after
//       function (checkpoints) {
//         this.checkpoints = checkpoints;
//       }.bind(this));
//   }
//
//   constructor() {
//     this.heading = "Checkpoints";
//     this.checkpoints = [];
//   }
// }
import {HttpClient} from 'aurelia-http-client';
import Dygraph from '../node_modules/dygraphs/dist/dygraph';

export class App {

  constructor() {
    this.heading = "Checkpoints";
    let client = new HttpClient()
      .configure(x => {
        x.withBaseUrl('http://localhost:9000');
      });

    client.get('checkpoints').then(function (response) {
      var checkpoints = JSON.parse(response.response);
      console.log(checkpoints)
      console.log(new Date(checkpoints[0].createdAt));
      console.log(new Date());
      chartHeartRate(checkpoints)
    }.bind(this));
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
