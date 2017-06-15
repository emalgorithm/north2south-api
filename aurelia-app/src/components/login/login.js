import {AuthService} from 'aurelia-authentication';
import {inject, computedFrom} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-framework'; 

export class Login {

    static inject = [AuthService, BindingEngine]

    _authenticated = false;
    user = {};
    subscription = {};

    constructor(authService, bindingEngine) {
        this.authService   = authService;
        this.providers     = [];

        this.bindingEngine = bindingEngine;
        this._authenticated = this.authService.isAuthenticated();
        this.getMe()

        this.subscription = bindingEngine.propertyObserver(this, 'authenticated')
            .subscribe((newValue, oldValue) => this.getMe());
    };

    getMe() {
        if (this.authenticated) {
            this.authService.getMe().then(data => {
                return this.user = data;
            });
        }
    }


    deactivate() {
        this.subscription.dispose();
    }


    // make a getter to get the authentication status.
    // use computedFrom to avoid dirty checking
    @computedFrom('authService.authenticated')
    get authenticated() {
      return this.authService.authenticated;
    }

    // use authService.login(credentialsObject) to login to your auth server
    login(username, password) {
      return this.authService.login({username, password});
    };

    // use authService.logout to delete stored tokens
    // if you are using JWTs, authService.logout() will be called automatically,
    // when the token expires. The expiredRedirect setting in your authConfig
    // will determine the redirection option
    logout() {
      return this.authService.logout();
    }

    // use authenticate(providerName) to get third-party authentication
    authenticate(name) {
      return this.authService.authenticate(name)
        .then(response => {

        });
    }
}