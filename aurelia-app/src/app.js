import 'bootstrap'
import 'material-dashboard'

export class App {
  constructor() {
  }

  configureRouter(config, router) {
    config.title = 'North2South';

    config.map([
      {
        route: '', name: 'journey-list',
        moduleId: 'components/journey/journey-list',
      },
      {
        route: 'journey', name: 'journey',
        moduleId: 'components/journey/journey'
      }
    ]);

    this.router = router;
  }
}