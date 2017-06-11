export class App {

  constructor() {
    this.heading = "North2South";
    this.date = new Date();
  }

  configureRouter(config, router) {
    config.title = 'North2South';

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
        route: 'journey/:id', name: 'journey',
        moduleId: './components/journey/journey', nav: true, href: '#/journey/1', title: 'Trip to South pole'
      }
    ]);
    this.router = router;
  }
}
