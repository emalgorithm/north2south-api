import 'bootstrap'
import 'material-dashboard'
import Chartist from 'chartist'
import { EventAggregator } from 'aurelia-event-aggregator'
import { RestApi } from 'services/api'
import moment from 'moment'
import { WeatherApi } from 'services/weatherApi'
import io from 'socket.io'
var socket = io.connect();

export class Journey {

  static inject = [RestApi, WeatherApi, EventAggregator]

  constructor(api, weatherApi, eventAggregator) {
    Object.assign(this, { api, weatherApi, eventAggregator })
    this.displayedDays = 7; /* For now */
    this.totalDistance = 0;
    /* Map setup */
    this.checkpoints = [];
    this.destination = {
      "latitude" : 0,
      "longitude": 0
    };
    this.mapLoaded = false;
    this.eventAggregator.subscribeOnce("mapLoaded", map => {
      this.mapLoaded = true;
      this.map = map;
      // Case 1: HTTP response has loaded first, and now map is loaded and we draw checkpoints
      this.addPointsToMap();
      console.log("Weather: ");
      console.log(this.weather);
    });
  }

  activate(params, routeConfig) {
    socket.on('checkpoint:save', checkpoint => this.onNewCheckpoint(checkpoint));

    return this.api.getJourney(params.id).then(journey => {
        Object.assign(this, ...journey);
        this.weatherApi.getCurrentWeather(this.latestCheckpoint.latitude, this.latestCheckpoint.longitude).then(weather => this.weather = weather);
        // Case 2: Map has loaded first, and now we get checkpoints from HTTP request and we draw checkpoints
        if (this.mapLoaded) {
          this.addPointsToMap();
        }
      }
    )
  }

  get shortDescription() {
    if (this.description.length > 500)
      return this.description.substr(0, 500 - '...'.length) + '...'
    return this.description
  }

  attached() {
    /* Get latest checkpoint */
    this.updateTotalDistance();
    this.drawGraph('heartRate', '.heart-rate-chart', 15,
      function(d) {
        return d.reduce(function(a, b) {return a + b;}) / d.length
      }
    )

    this.drawGraph('calories', '.calories-chart', 200,
      function(d) {
        return Math.max.apply(null, d.filter(x => x !== null && !isNaN(x)))
      }
    )
    this.setup_twitter_feed()
  }

  updateTotalDistance() {
    let groups = this.checkpoints.reduce(function (cs, c) {
      (cs[moment(c.createdAt).format('MMM DD')] = cs[moment(c.createdAt).format('MMM DD')] || []).push(c);
      return cs;
    }, {});

    for (let p in groups) {
      if (groups.hasOwnProperty(p)) {
        let data = groups[p].map(function (a) {
          return a['distance'];
        })
        this.totalDistance = Math.max.apply(null, data.filter(x => x !== null && !isNaN(x)))
        return;
      }
    }
  }

  addPointsToMap() {
    this.map.addDestination(this.destination.latitude, this.destination.longitude);
    this.checkpoints.forEach(function (checkpoint) {
      this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
    }.bind(this));
  }


  getGraphData(groups, field, choose) {
    let dataAndDates = []

    for (let property in groups) {
      if (groups.hasOwnProperty(property)) {
        let data = groups[property].map(function(a) { return a[field]; })
        dataAndDates.push([property, choose(data)]);
      }
    }

    let dateLabels = []
    let dataSeries = []

    if (dataAndDates.length > 0) {
      dateLabels.push(dataAndDates[0][0])
      dataSeries.push(dataAndDates[0][1])
      let current = 1;
      let lastDate = dataAndDates[0][0]
      for (let i = 1; i < this.displayedDays; i++) {
        if (current < dataAndDates.length && this.isNext(dataAndDates[current][0], lastDate)) {
          dateLabels.push(dataAndDates[current][0])
          dataSeries.push(dataAndDates[current][1])
          lastDate = dataAndDates[current][0]
          current += 1
        } else {
          lastDate = moment(lastDate, 'MMM/DD', false).add(-1, 'days').format('MMM DD')
          dateLabels.push(lastDate)
          dataSeries.push(undefined)
        }
      }
    } else {
      /* This week's days with no data */
      for (let i = this.displayedDays - 1; i >= 0; i--) {
        dateLabels.push(moment().add(-i, 'days').format('MMM DD'))
      }
    }

    return {
      labels: dateLabels.reverse(),
      series: [dataSeries.reverse()]
    };
  }

  drawGraph(property, graphElem, limit, choose) {

    let groups = this.checkpoints.reduce(function (cs, c) {
      (cs[moment(c.createdAt).format('MMM DD')] = cs[moment(c.createdAt).format('MMM DD')] || []).push(c);
      return cs;
    }, {});

    let propertyData = this.getGraphData(groups, property, choose)


    let options = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: Math.min.apply(Math, propertyData.series[0].filter(x => !isNaN(x) && x !== null)) - limit,
      high: Math.max.apply(Math, propertyData.series[0].filter(x => !isNaN(x) && x !== null)) + limit,
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    };

    let chart = new Chartist.Line(graphElem, propertyData, options);

    md.startAnimationForLineChart(chart);
  }

  isNext(d1, d2) {
    return moment(d2, 'MMM/DD', false).diff(moment(d1, 'MMM/DD', false), 'days') == 1
  }

  onNewCheckpoint(checkpoint) {
    console.log("Getting socket updates:  " + checkpoint);

    //Update other fields
    this.calories = checkpoint.calories;
    this.distance = checkpoint.distance;

    if (this.mapLoaded) {
      this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
    }
  }

  setup_twitter_feed = function() {
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
  }
}
