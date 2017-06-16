import 'bootstrap-notify'
import io from 'socket.io'

export class FollowingNotifications {

  following = []

  constructor() {
    this.socket = io.connect()

    // Handle future notifications
    this.socket.on('notification', FollowingNotifications.notify)
    this.socket.on('checkpoint:save', ({ checkpoint, owner}) => {
      let followedName = this.findFollowedById(owner).name
      let profileUrl = `#/profile/${owner}`
      FollowingNotifications.notify(`${followedName} created a new checkpoint`, profileUrl)
    })
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