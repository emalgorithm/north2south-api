import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';
import {BindingEngine, bindable, decorators } from 'aurelia-framework'; 

export const Navigation = decorators(
    bindable('router')).on(class {

    static inject = [AuthService, BindingEngine]

    _isAuthenticated = false;
    user = {};

    subscription = {};

    constructor(auth, bindingEngine) {
        debugger;
        this.auth = auth;
        this.bindingEngine = bindingEngine;
        this._isAuthenticated = this.auth.isAuthenticated();
        this.getMe()

        this.subscription = bindingEngine.propertyObserver(this, 'isAuthenticated')
            .subscribe((newValue, oldValue) => getMe());
    }

    getMe() {
        if (this.isAuthenticated) {
            this.auth.getMe().then(data => {
                return this.user = data;
            });
        }
    }

    get isAuthenticated() {
        return this.auth.isAuthenticated();
    }

    deactivate() {
        this.subscription.dispose();
    }

})