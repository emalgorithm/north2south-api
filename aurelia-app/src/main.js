import environment from './environment';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.use
    .plugin('aurelia-google-maps', config => {
      config.options({
        apiKey: 'AIzaSyAXwYqFZxpik8C0iIJgwuTroW1KyCSX_jk', // use `false` to disable the key
        apiLibraries: 'drawing,geometry', //get optional libraries like drawing, geometry, ... - comma seperated list
        options: { panControl: true, panControlOptions: { position: 9 } } //add google.maps.MapOptions on construct (https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions)
      });
    })

  aurelia.start().then(() => aurelia.setRoot());
}
