import moment from 'moment'
import { DataAnalyticsHelpers } from './dataAnalyticsHelpers'

export class CaloriesAnalyticsService {

  constructor(checkpoints) {
    this.checkpoints = checkpoints
  }

  analysis() {
    this.weeklyCheckpoints = DataAnalyticsHelpers.groupCheckpointsByWeek(this.checkpoints)

    let latestCalories = this.weeklyCheckpoints.thisWeek[0].calories
    let referenceValue = 2000

    return DataAnalyticsHelpers.analyse(latestCalories, referenceValue,
      'than the normal daily calorie burn', ['more', 'less'])
  }

  valueFunction(xs) {
    return Math.max.apply(null, xs.filter(x => x !== null && !isNaN(x)))
  }

}