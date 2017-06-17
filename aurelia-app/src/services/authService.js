import { AuthService as AuthServiceProvider } from 'aurelia-authentication'
import { inject, computedFrom } from 'aurelia-framework'

@inject(AuthServiceProvider)
export class AuthService {

  provider = 'facebook'
  user = {}

  constructor(auth) {
    this.auth = auth

    // Pre-fetch user profile if already authenticated
    if (auth.authenticated) {
    	this.auth.getMe().then(data => this.user = data)
    }
  }

  // Authenticate with a provider
  // Supported provider is 'facebook'
  authenticate() {
    return this.auth.authenticate(this.provider)
      .then(response => this.user = response.user)
  }

  @computedFrom('auth.authenticated')
  get authenticated() {
    return this.auth.authenticated;
  }

  logout() {
    this.user = {}
    return this.auth.logout();
  }
}