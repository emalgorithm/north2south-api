import { RestApi } from 'services/api'
import { AuthService } from '../services/authService'
import { Config } from "aurelia-api"
import { Router } from 'aurelia-router'
import { FollowingNotifications } from '../services/followingNotifications'
import { computedFrom } from 'aurelia-framework'

export class Profile {

  static inject =[RestApi, AuthService, Config, Router, FollowingNotifications]

  _following = false

  constructor(restApi, authService, config, router, followingNotifications) {
    this.restApi = restApi
    this.authService = authService
    this.apiEndpoint = config.getEndpoint('api')
    this.router = router
    this.followingNotifications = followingNotifications
  }

  activate(params, routeConfig) {
    this._following = false
    this.restApi.getJourneysOfUser(params.id).then(journeys => this.journeys = journeys)

    return this.restApi.getUser(params.id).then(user => {
      this.user = user;
    })
  }

  @computedFrom('followingNotifications.following', 'user', '_following')
  get following() {
    return this._following ||
      this.followingNotifications.isPrincipalFollowing(this.user.id)
  }

  follow() {
    var follow = Promise.method(() => this.authService.user)()
    if (!this.authService.authenticated) {
      follow = this.authService.authenticate()
    }

    return follow
      .then(profile => this.apiEndpoint.post(`/users/${profile.id}/followers`, {
        "id": this.user.id
      }))
      .then(response => {
        this._following = true
        this.followingNotifications.follow(this.user)
        this.followingNotifications.notify(`You are now following ${this.user.name}`)
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
