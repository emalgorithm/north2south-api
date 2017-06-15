import { RestApi } from 'services/api'
import {AuthService} from 'aurelia-authentication';
import {Login} from "./login/login";

export class Profile {

  static inject = [RestApi, AuthService, Login]

  constructor(restApi, authService, login) {
    this.restApi = restApi
    this.authService = authService
    this.login = login
  }

  activate(params, routeConfig) {
    this.restApi.getJourneysOfUser(params.id).then(journeys => this.journeys = journeys)

    return this.restApi.getUser(params.id).then(user => {
      Object.assign(this, ...user);
    })
  }

  follow() {
    if (!this.authService.authenticated) {
      console.log('you are not auth')
      this.login.authenticate('facebook')
    } else {
      console.log('you are auth')
    }
  }
}
