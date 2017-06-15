import { RestApi } from 'services/api'

export class Profile {

  static inject = [RestApi]

  constructor(restApi) {
    this.restApi = restApi
  }

  activate(params, routeConfig) {
    this.restApi.getJourneysOfUser(params.id).then(journeys => this.journeys = journeys)

    return this.restApi.getUser(params.id).then(user => {
      Object.assign(this, ...user);
    })
  }
}
