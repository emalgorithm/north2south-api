import { RestApi } from 'services/api'
import {AuthService} from 'aurelia-authentication';
import {Login} from "./login/login";
import {Config} from "aurelia-api";
import { Router } from 'aurelia-router';

export class Profile {

  static inject = [RestApi, AuthService, Login, Config, Router]

  constructor(restApi, authService, login, config, router) {
    this.restApi = restApi
    this.authService = authService
    this.login = login
    this.apiEndpoint = config.getEndpoint('api')
    this.router = router
  }

  activate(params, routeConfig) {
    this.restApi.getJourneysOfUser(params.id).then(journeys => this.journeys = journeys)

    return this.restApi.getUser(params.id).then(user => {
      this.user = user;
    })
  }

  follow() {
    if (!this.authService.authenticated) {
      this.login.authenticate('facebook')
      if (!this.authService.authenticated) {
        return
      }
    }
    return this.authService.getMe().then(
      profile =>  this.apiEndpoint.post(`/users/${profile.id}/followers`, { "id": this.user.id })
    )
  }

  select(journeyId) {
    this.router.navigateToRoute('journey', {
      id: journeyId
    })
  }

}
