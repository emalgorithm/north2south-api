export class App {

  constructor() {
    this.heading = "NorthToSouth";
    this.date = new Date();
  }

  configureRouter(config, router) {
    config.title = 'Webapps';

    config.map([
      {
        route: ['', 'home'], name: 'home',
        moduleId: './home', nav: true, title: 'Home'
      },
      {
        route: 'about', name: 'about',
        moduleId: './about', nav: true, title: 'About'
      },
      {
        route: 'journeys/southpole', name: 'southpole',
        moduleId: './southpole', nav: true, title: 'Trip to South pole'
      }
    ]);

    this.router = router;
  }
}
