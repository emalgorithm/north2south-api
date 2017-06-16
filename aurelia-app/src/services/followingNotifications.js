import 'bootstrap-notify'
import io from 'socket.io'

export class FollowingNotifications {

  constructor(following) {
    this.socket = io.connect()

    // Subscribe for notifications about followed users
    this.socket.emit('notify-me', following, notifications => {
      const notificationsToShow = Math.min(notifications.length, 3)
      for (var i = notificationsToShow - 1; i >= 0; i--) {
        this.notify(notifications[i])
      }
    })

    // Handle future notifications
    this.socket.on('notification', this.notify)
  }

  notify(message) {
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