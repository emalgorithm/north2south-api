import { RestApi } from 'services/api'
import { Router } from 'aurelia-router';

export class JourneyList {

  static inject = [RestApi, Router]
  constructor(api, router) {
    this.api = api
    this.router = router

    var journeyViewModel = {
      name: 'North By South 2017',
      owner: {
        name: 'James Redden',
        avatar: '../assets/img/norway-me.jpg',
        profileUrl: '#'
      },
      focusedMessage: {
        title: 'Reflecting on day 21',
        content: 'In 2017 I will attempt a full distance, solo, unsupported and unaided ski to the South Pole. The aim of this expedition is to raise money for Soundabout.org.uk, a UK-based charity which uses music as a form of therapy for disabled childrend and adults. I will also be raising money for a second charity and the official announcement will be made soon. Start date will be November 2017 (lots of planning and funding to raise hence announcing now; 17 months before I set off). Distance is about 683 miles and one I’m aiming to complete in under 30 days. In between...',
      },
      focusedCheckpoint: {
        icon: 'directions_run',
        title: 'Distance covered today',
        content: '24.245 km'
      }
    }

    this.journeys = [
      journeyViewModel,
      journeyViewModel,
      journeyViewModel
    ]
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
