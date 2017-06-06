import {HttpClient} from 'aurelia-http-client';
import Dygraph from '../node_modules/dygraphs/dist/dygraph';
import io from '../node_modules/socket.io-client/dist/socket.io';
var socket = io.connect();

export class Southpole {

  attached() {

    let client = new HttpClient()
      .configure(x => {
        x.withBaseUrl('/');
      });
    client.get('checkpoints').then(function (response) {
      var checkpoints = JSON.parse(response.response);
      this.dateAndHeartRates = checkpoints.map(c => [new Date(c.createdAt), c.heartRate])
      console.log(this.dateAndHeartRates)
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
        console.log("Getting socket updates:  " + checkpoint)

        // Update chart real time
        this.dateAndHeartRates.push([new Date(checkpoint.createdAt), checkpoint.heartRate])
        this.heartRateChart.updateOptions( { 'file': this.dateAndHeartRates } );

        //Update other fields
        this.calories = checkpoint.calories
        this.distance = checkpoint.distance

      }.bind(this));
    init_sample()
    setup_twitter_feed()
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

let init_sample = function () {
  var g = new Dygraph(
    document.getElementById("distance"),
    "Date,km\n" +
    "2008-05-07,75\n" +
    "2008-05-08,70\n" +
    "2008-05-09,80\n", {
      rollPeriod: 7,
      strokeWidth: 3,
      pointSize: 5,
      errorBars: true,
      visibility: [true],
      colors: ["#ad0505"]
    }
  );
  var g2 = new Dygraph(
    document.getElementById("heartRate"),
    "Date,hbps\n" +
    "2008-05-07,75\n" +
    "2008-05-08,70\n" +
    "2008-05-09,80\n", {
      rollPeriod: 7,
      strokeWidth: 3,
      pointSize: 5,
      errorBars: true,
      visibility: [true],
      colors: ["#05a502"]
    }
  );
  var g3 = new Dygraph(
    document.getElementById("calories"),
    "Date,calories\n" +
    "2008-05-07,75\n" +
    "2008-05-08,70\n" +
    "2008-05-09,80\n", {
      rollPeriod: 7,
      strokeWidth: 3,
      pointSize: 5,
      errorBars: true,
      visibility: [true],
      colors: ["#0310a5"]
    }
  );
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


function init_map() {
  //document.write('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAXwYqFZxpik8C0iIJgwuTroW1KyCSX_jk&callback=initMap"></script>');
  let script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAXwYqFZxpik8C0iIJgwuTroW1KyCSX_jk&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);


  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
