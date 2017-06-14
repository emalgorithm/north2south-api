import { RestApi } from 'services/api'
import { Router } from 'aurelia-router';

export class JourneyList {

  static inject = [RestApi, Router]
  constructor(api, router) {
    this.api = api
    this.router = router

  }

  activate(params, routeConfig) {
    // choose watch journeys to display based on routeConfig.name
    // it could be one of latest, mostFunded, trending, followed, etc.
  }

  created() {
    this.api.getJourneyList().then(journeys => this.journeys = journeys)
  }

  gotoProfile(event, userId) {
      event.stopPropagation()
      this.router.navigateToRoute('profile', {
        id: userId
      })
  }

  select(journeyId) {
    this.router.navigateToRoute('journey', {
      id: journeyId
    })
  }
}
