import 'bootstrap-notify'
import io from 'socket.io'

export class FollowingNotifications {

  constructor() {
    this.socket = io.connect()

    // Handle future notifications
    this.socket.on('notification', FollowingNotifications.notify)
  }

  follow(following) {
    this.followMany([following])
  }

  followMany(following) {
    // Subscribe for notifications about followed users
    this.socket.emit('notify-me', following, notifications => {
      const notificationsToShow = Math.min(notifications.length, 3)
      for (var i = notificationsToShow - 1; i >= 0; i--) {
        FollowingNotifications.notify(notifications[i])
      }
    })
  }

  static notify(message) {
    $.notify({
      icon: "notifications",
      message: message
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