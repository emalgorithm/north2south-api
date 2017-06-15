import environment from './environment'
import authConfig from './authConfig'

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    /* setup the api endpoints first */
    .plugin('aurelia-api', configure => {
      configure
        .registerEndpoint('api', '/api')
        .setDefaultEndpoint('api');
    })

    /* configure aurelia-authentication to use above aurelia-api endpoints */
    .plugin('aurelia-authentication', baseConfig => {
        baseConfig.configure(authConfig);
        /* At this point, baseConfig.client is the aurelia-api Rest client from the 'auth' endpoint. The HttpClient is baseConfig.client.client */
    });;

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
