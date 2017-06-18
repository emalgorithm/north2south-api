import 'bootstrap-notify'
import io from 'socket.io'
import { inject, BindingEngine } from 'aurelia-framework'
import { AuthService } from 'services/authService'

@inject(AuthService, BindingEngine)
export class FollowingNotifications {

  following = []
  subscription = {}
  notificationsDisplayed = 0
  notificationsLimit = 3

  constructor(authService, bindingEngine) {
    this.socket = io.connect()

    // Handle future notifications
    this.socket.on('notification', FollowingNotifications.notify)
    this.socket.on('checkpoint:save', ({checkpoint, owner}) => {
      let followedName = this.findFollowedById(owner).name
      let journeyUrl = `#/journey/${checkpoint.journey}`
      this.notify(`${followedName} created a new checkpoint`, journeyUrl)
    })
    this.socket.on('statusUpdate:save', ({statusUpdate}) => {
      let journeyUrl = `#/journey/${statusUpdate.journey}`
      this.notify(`${statusUpdate.createdBy.name}: ${statusUpdate.title}`, journeyUrl)
    })

    this.subscription = bindingEngine
      .propertyObserver(authService, 'user')
      .subscribe(this.principalChanged.bind(this))

    this.notificationInterval()
  }

  notificationInterval() {
    // Clear notification limit every 30 seconds
    this.interval = setInterval(() => this.notificationsDisplayed = 0, 30 * 1000)
  }

  deactivate() {
    clearInterval(this.interval)
  }

  principalChanged(newValue, oldValue) {
    this.unfollowAll()
    if (newValue.following) {
      this.followMany(newValue.following)
    }
  }

  isPrincipalFollowing(id) {
    return this.following &&
      this.following.some(f => (f._id || f.id) === id)
  }

  unfollowAll() {
    this.following = []
    // TODO: Exit socket rooms on the server
  }

  follow(following) {
    this.followMany([following])
  }

  followMany(following) {
    // Store all followed users
    this.following.push.apply(this.following, following)

    // Subscribe for notifications about followed users
    this.socket.emit('notify-me', following.map(f => f._id || f.id), notifications => {
      const notificationsToShow = Math.min(notifications.length, 3)
      for (var i = notificationsToShow - 1; i >= 0; i--) {
        this.notify(notifications[i])
      }
    })
  }

  findFollowedById(followedId) {
    return this.following.find(f => (f._id || f.id) === followedId)
  }

  deactivate() {
    this.subscription.dispose()
  }

  notify(message, url) {
    // Don't display notification if there are already too many
    if (this.notificationsDisplayed >= this.notificationsLimit) {
      return
    }

    this.notificationsDisplayed += 1

    $.notify({
      icon: "notifications",
      message: message,
      url: url,
      target: '_self'
    }, {
      type: 'primary',
      timer: 4000,
      placement: {
        from: 'bottom',
        align: 'left'
      }
    });
  }
}