import { inject } from 'aurelia-framework'
import { AuthService } from '../../services/authService'

@inject(AuthService)
export class Login {
  constructor(authService) {
    this.authService = authService
  }
}