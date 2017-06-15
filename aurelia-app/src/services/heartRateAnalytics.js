import moment from 'moment'
import { DataAnalyticsHelpers } from './dataAnalyticsHelpers'

export class HeartRateAnalyticsService {

  constructor(checkpoints) {
    this.checkpoints = checkpoints
  }

  analysis() {
    this.weeklyCheckpoints = DataAnalyticsHelpers.groupCheckpointsByWeek(this.checkpoints)

    let thisWeekValue = this.valueFunction(this.weeklyCheckpoints.thisWeek)
    let beforeValue = this.valueFunction(this.weeklyCheckpoints.before)

    return DataAnalyticsHelpers.analyse(thisWeekValue, beforeValue,
      'recovery than previous weeks', ['faster', 'slower'])
  }

  valueFunction(xs) {
    if (xs.length == 0) {
      return 0
    }

    return xs.reduce((ys, y) => ys + y, 0) / xs.length
  }
}
