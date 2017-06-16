import { RestApi } from 'services/api'
import { AuthService } from 'aurelia-authentication';
import { Login } from "./login/login";
import { Config } from "aurelia-api";
import { Router } from 'aurelia-router';
import { FollowingNotifications } from '../services/followingNotifications'
import { computedFrom } from 'aurelia-framework'

export class Profile {

  static inject =[RestApi, AuthService, Login, Config, Router, FollowingNotifications]

  _following = false

  constructor(restApi, authService, login, config, router, followingNotifications) {
    this.restApi = restApi
    this.authService = authService
    this.login = login
    this.apiEndpoint = config.getEndpoint('api')
    this.router = router
    this.followingNotifications = followingNotifications
  }

  activate(params, routeConfig) {
    this.restApi.getJourneysOfUser(params.id).then(journeys => this.journeys = journeys)

    return this.restApi.getUser(params.id).then(user => {
      this.user = user;
    })
  }

  @computedFrom('login.user', 'user', '_following')
  get following() {
    return this._following || this.login.user.following && this.login.user.following.some(f => f._id === this.user.id)
  }

  set following(val) {
    this._following = val
  }

  follow() {
    var follow = Promise.method(() => this.login.user)()
    if (!this.authService.authenticated) {
      follow = this.login.authenticate('facebook')
    }

    return follow
      .then(profile => this.apiEndpoint.post(`/users/${profile.id}/followers`, {
        "id": this.user.id
      }))
      .then(response => {
        this.following = true
        this.followingNotifications.follow(this.user)
        FollowingNotifications.notify(`You are now following ${this.user.name}`)
      })
  }

  select(journeyId) {
    this.router.navigateToRoute('journey', {
      id: journeyId
    })
  }

  gotoProfile(userId) {
    console.log(userId)
    this.router.navigateToRoute('profile', {
      id: userId
    })
  }
}
