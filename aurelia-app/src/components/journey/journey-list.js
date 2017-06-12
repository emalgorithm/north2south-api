import { RestApi } from 'services/api'

export class JourneyList {

  static inject = [RestApi]
  constructor(api) {
    this.api = api

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

  created() {
    this.api.getJourneyList().then(journeys => this.journeys = journeys)
  }
}