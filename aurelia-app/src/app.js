import 'bootstrap'
import 'material-dashboard'

export class App {
  constructor() {
  }

  configureRouter(config, router) {
    config.title = 'North2South'
    config.addPipelineStep('postcomplete', PostCompleteStep);
    config.map([
      {
        // This is also the default route
        route: ['', 'latest'], name: 'latest',
        moduleId: 'components/journey/journey-list',
        title: 'Latest', nav: true
      },
      {
        route: ['challenges'], name: 'challenges',
        moduleId: 'components/challenges/challenges',
        title: 'Challenges', nav: true
      },
      {
        // Uses the same module as latest
        route: ['most-funded'], name: 'mostFunded',
        moduleId: 'components/journey/journey-list',
        title: 'Most Funded', nav: true
      },
      {
        // Not part of the navigation bar
        route: 'journey/:id', name: 'journey',
        moduleId: 'components/journey/journey'
      },
      {
        route: 'profile/:id', name: 'profile',
        moduleId: 'components/profile'
      }
    ])

    this.router = router
  }
}

class PostCompleteStep {
  run(instruction, next) {
    if (!instruction.config.settings.noScrollToTop) {
      window.scrollTo(0, 0);
    }

    return next();
  }
}
