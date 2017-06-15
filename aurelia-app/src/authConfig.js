export default {
    profileUrl: '/users/me',
    endpoint: 'api',                   // '' for the default endpoint
    configureEndpoints: ['api'], // '' for the default endpoint    
    providers: {
        facebook: {
          name: 'facebook',
          url: '/auth/facebook',  // api route to facebook methods
          clientId: '833296696833499'  // id of the facebook app
        }
    }
}