var config = {
  profileUrl: '/users/me',
  endpoint: 'api', // '' for the default endpoint
  configureEndpoints: ['api'], // '' for the default endpoint    
  providers: {
    facebook: {
      name: 'facebook',
      url: '/auth/facebook', // api route to facebook methods
      clientId: '' // id of the facebook app
    }
  }
}

if (window.location.hostname === 'localhost') {
  config.providers.facebook.clientId = '833296696833499';
} else {
  config.providers.facebook.clientId = '1448046271898825';
}

export default config