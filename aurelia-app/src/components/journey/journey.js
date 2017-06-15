import 'bootstrap'
import 'material-dashboard'
import Chartist from 'chartist'
import { EventAggregator } from 'aurelia-event-aggregator'
import { RestApi } from 'services/api'
import moment from 'moment'
import { WeatherApi } from 'services/weatherApi'
import { CaloriesAnalyticsService } from 'services/caloriesAnalytics'
import { HeartRateAnalyticsService } from 'services/heartRateAnalytics'
import io from 'socket.io'
import { Router } from 'aurelia-router';

var socket = io.connect();

export class Journey {

  static inject = [RestApi, WeatherApi, EventAggregator, Router]

  constructor(api, weatherApi, eventAggregator, router) {
    Object.assign(this, { api, weatherApi, eventAggregator, router })

    this.heartRateOptions = ['Week', 'Live', 'All']
    this.heartRateSelection = this.heartRateOptions[0]

    this.heartRateAnalytics = new HeartRateAnalyticsService([])
    this.caloriesAnalytics = new CaloriesAnalyticsService([])

    this.totalDistance = 0;
    /* Map setup */
    this.checkpoints = [];
    this.destination = {
      "latitude" : 0,
      "longitude": 0
    };

    this.mapLoaded = false;
    this.mapScroll = false;
    this.eventAggregator.subscribeOnce("mapLoaded", map => {
      this.mapLoaded = true;
      this.map = map;
      this.map.setOptions({scrollwheel: false, minZoom: 2, maxZoom: 15 });

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

        this.updateTotalDistance()
        this.heartRateAnalytics.checkpoints = this.checkpoints
        this.caloriesAnalytics.checkpoints = this.checkpoints

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

  resetTimer() {
    clearTimeout(this.timer);
    if (this.mapScroll) {
      this.mapScroll = false;
      this.map.setOptions({ scrollwheel: false })
    }
  }

  enableScrolling() {
    this.timer = setTimeout(function() {
      this.mapScroll = true;
      this.map.setOptions({ scrollwheel: true })
    }.bind(this), 3000);
  }

  attached() {
    /* Get latest checkpoint */
    this.setup_twitter_feed()
  }

  gotoProfile() {
    this.router.navigateToRoute('profile', {
      id: this.owner.id
    })
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
