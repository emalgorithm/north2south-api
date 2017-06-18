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
import { Router } from 'aurelia-router'
import {AuthService} from 'services/authService'
import {Config} from "aurelia-api"
import { FollowingNotifications } from 'services/followingNotifications'
import { computedFrom } from 'aurelia-framework'

export class Journey {

  static inject = [RestApi, WeatherApi, EventAggregator, Router, AuthService, Config, FollowingNotifications]

  constructor(api, weatherApi, eventAggregator, router, authService, config, followingNotifications) {
    Object.assign(this, { api, weatherApi, eventAggregator, router, authService, followingNotifications })

    this.socket = io.connect();

    this.apiEndpoint = config.getEndpoint('api')

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
    this._following = false

    this.socket.on('checkpoint:save', ({ checkpoint }) => {
      this.onNewCheckpoint(checkpoint)
    })

    this.socket.on('statusUpdate:save', ({ statusUpdate }) => {
      this.onNewStatusUpdate(statusUpdate)
    })

    return this.api.getJourney(params.id).then(journey => {
        journey.checkpoints.reverse()
        journey.statusUpdates.reverse()

        Object.assign(this, ...journey);

        // Request to join room for this journey
        this.socket.emit('join:journey', journey.id)

        this.updateTotalDistance()
        this.heartRateAnalytics.checkpoints = this.checkpoints
        this.caloriesAnalytics.checkpoints = this.checkpoints

        // TODO: Handle this (Don't display broken weather)
        if (!this.latestCheckpoint) {
          return
        }

        this.weatherApi.getCurrentWeather(this.latestCheckpoint.latitude, this.latestCheckpoint.longitude).then(weather => this.weather = weather);
        // Case 2: Map has loaded first, and now we get checkpoints from HTTP request and we draw checkpoints
        if (this.mapLoaded) {

          this.addPointsToMap();
        }
      }
    )
  }

  @computedFrom('followingNotifications.following', 'owner', '_following')
  get following() {
    return this._following ||
      this.followingNotifications.isPrincipalFollowing(this.owner.id)
  }

  @computedFrom('description')
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

    this.checkpoints.unshift(checkpoint)

    //Update other fields
    this.calories = checkpoint.calories;
    this.distance = checkpoint.distance;

    if (this.mapLoaded) {
      this.map.addMarker(checkpoint.latitude, checkpoint.longitude);
    }
  }

  follow() {
    var follow = Promise.method(() => this.authService.user)()
    if (!this.authService.authenticated) {
      follow = this.authService.authenticate()
    }

    return follow
      .then(profile => this.apiEndpoint.post(`/users/${profile.id}/followers`, {
        "id": this.owner.id
      }))
      .then(response => {
        this._following = true
        this.followingNotifications.follow(this.owner)
        this.followingNotifications.notify(`You are now following ${this.owner.name}`)
      })
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

  submitComment() {
    let comment = {
      title: this.commentTitle,
      content: this.commentContent,
      journey: this.id,
    }

    this.apiEndpoint.post('/statusUpdates', comment)
      .then(response => response)
  }

  onNewStatusUpdate(status) {
    this.statusUpdates.unshift(status)
  }
}
