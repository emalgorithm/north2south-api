import {HttpClient} from 'aurelia-http-client';
import io from '../../../../node_modules/socket.io-client/dist/socket.io';
var socket = io.connect();

export class Southpole {

  journey;

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
    Logger.info("Inside journey attached(), the map is: ");
    this.map = this.component.currentViewModel;
    console.log(this.map)

    this.client.get('checkpoints').then(function (response) {
      var checkpoints = JSON.parse(response.response);

      checkpoints.forEach(function (checkpoint) {
        this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
      }.bind(this))

    }.bind(this));

    socket.on('checkpoint:save',
      function (checkpoint) {
        Logger.info("Getting socket updates:  " + checkpoint)

        //Update other fields
        this.calories = checkpoint.calories
        this.distance = checkpoint.distance

        //this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
      }.bind(this));

    setup_twitter_feed()
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
