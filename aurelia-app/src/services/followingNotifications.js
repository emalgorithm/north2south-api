import 'bootstrap-notify'
import io from 'socket.io'
import { inject, BindingEngine } from 'aurelia-framework'
import { AuthService } from 'services/authService'

@inject(AuthService, BindingEngine)
export class FollowingNotifications {

  following = []
  subscription = {}

  constructor(authService, bindingEngine) {
    this.socket = io.connect()

    // Handle future notifications
    this.socket.on('notification', FollowingNotifications.notify)
    this.socket.on('checkpoint:save', ({checkpoint, owner}) => {
      let followedName = this.findFollowedById(owner).name
      let profileUrl = `#/journey/${checkpoint.journey}`
      FollowingNotifications.notify(`${followedName} created a new checkpoint`, profileUrl)
    })

    this.subscription = bindingEngine
      .propertyObserver(authService, 'user')
      .subscribe(this.principalChanged.bind(this))
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
        FollowingNotifications.notify(notifications[i])
      }
    })
  }

  findFollowedById(followedId) {
    return this.following.find(f => (f._id || f.id) === followedId)
  }

  deactivate() {
    this.subscription.dispose()
  }

  static notify(message, url) {
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