import {HttpClient} from 'aurelia-http-client';

export class Home {

  constructor() {

    this.client = new HttpClient()
      .configure(x => {
        x.withBaseUrl('/');
      });

    this.client.get('journeys/').then(function(response) {
      this.journeys = JSON.parse(response.response);
    }.bind(this));

  }

}
