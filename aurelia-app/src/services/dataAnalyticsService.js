import moment from 'moment'

export class DataAnalyticsService {

  constructor(checkpoints) {
    this.weeklyCheckpoints = this.groupCheckpointsByWeek(checkpoints)
  }

  analyseHeartRate() {
    return this.analyse(this.meanFunction, 'recovery than previous weeks')
  }

  meanFunction(xs) {
    if (xs.length == 0) {
      return 0
    }

    return xs.reduce((ys, y) => ys + y.heartRate, 0) / xs.length
  }

  analyse(valueFunction, description) {
    let thisWeekValue = valueFunction(this.weeklyCheckpoints.thisWeek)
    let beforeValue = valueFunction(this.weeklyCheckpoints.before)

    if (!thisWeekValue || !beforeValue)
      return null;

    let percentageIncrease = (thisWeekValue * 100 / beforeValue) - 100
    let adjective = percentageIncrease >= 0 ? 'faster' : 'slower'

    return {
      isPositive: percentageIncrease >= 0,
      percentage: `${Math.abs(percentageIncrease.toFixed())}%`,
      description: `${adjective} ${description}`
    }
  }

  groupCheckpointsByWeek(checkpoints) {
    let weekGroups = {
      thisWeek: [],
      before: []
    }

    if (checkpoints.length === 0) {
      return weekGroups
    }

    let thisWeek = moment(checkpoints[0].createdAt).format('WW YYYY');
    for (let c of checkpoints) {
      let checkpointWeek = moment(c.createdAt).format('WW YYYY')
      if (checkpointWeek === thisWeek) {
        weekGroups.thisWeek.push(c)
      } else {
        weekGroups.before.push(c)
      }
    }

    return weekGroups
  }

}
