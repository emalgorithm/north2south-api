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
        moduleId: './components/home/home', nav: true, title: 'Home'
      },
      {
        route: 'about', name: 'about',
        moduleId: './components/about/about', nav: true, title: 'About'
      },
      {
        route: 'journeys/1', name: 'journey1',
        moduleId: './components/journeys/1/1', nav: true, title: 'Trip to South pole'
      }
    ]);

    this.router = router;
  }
}
