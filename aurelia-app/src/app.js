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
      chartHeartRate(checkpoints)
    }.bind(this));
  }
}

var chartHeartRate = function (checkpoints) {
  var data = checkpoints.map(c => [new Date(c.createdAt), c.heartRate])

  new Dygraph(document.getElementById("chart"),
    data,
    {
      labels: [ "Time", "HeartRate"]
    });
}
