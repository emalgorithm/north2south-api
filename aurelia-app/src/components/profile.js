import { RestApi } from 'services/api'
import {AuthService} from 'aurelia-authentication';
import {Login} from "./login/login";
import {Config} from "aurelia-api";


export class Profile {

  static inject = [RestApi, AuthService, Login, Config]

  constructor(restApi, authService, login, config) {
    this.restApi = restApi
    this.authService = authService
    this.login = login
    this.apiEndpoint = config.getEndpoint('api')
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
}
