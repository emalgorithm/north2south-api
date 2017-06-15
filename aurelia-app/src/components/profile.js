import { RestApi } from 'services/api'

export class Profile {

  static inject = [RestApi]

  constructor(restApi) {
    this.restApi = restApi
  }

  activate(params, routeConfig) {
    console.log('the parameter is' + params.id)
    return this.restApi.getUser(params.id).then(user => {
      Object.assign(this, ...user);
    })
  }
}
