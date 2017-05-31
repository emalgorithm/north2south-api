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

export class App {

  constructor() {
    this.heading = "Checkpoints";
    let client = new HttpClient()
      .configure(x => {
        x.withBaseUrl('http://localhost:9000');
      });

    client.get('checkpoints').then(function (response) {
      var checkpoints = JSON.parse(response.response);
      this.checkpoints = checkpoints;
    }.bind(this));
  }
}
