import moment from 'moment'

export class DataAnalyticsService {

  constructor(checkpoints) {
    this.weeklyCheckpoints = this.groupCheckpointsByWeek(checkpoints)
  }

  analyseHeartRate() {
    let thisWeekValue = this.meanFunction(this.weeklyCheckpoints.thisWeek)
    let beforeValue = this.meanFunction(this.weeklyCheckpoints.before)

    return this.analyse(thisWeekValue, beforeValue,
      'recovery than previous weeks', ['faster', 'slower'])
  }

  analyseCalories() {
    let latestCalories = this.weeklyCheckpoints.thisWeek[0].calories
    let referenceValue = 2000

    return this.analyse(latestCalories, referenceValue,
      'than the normal daily calorie burn', ['more', 'less'])
  }

  meanFunction(xs) {
    if (xs.length == 0) {
      return 0
    }

    return xs.reduce((ys, y) => ys + y.heartRate, 0) / xs.length
  }

  analyse(current, reference, description, adjectiveOptions) {

    if (!current || !reference)
      return null;

    let percentageIncrease = (current * 100 / reference) - 100
    let adjective = percentageIncrease >= 0 ? adjectiveOptions[0] : adjectiveOptions[1]

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
