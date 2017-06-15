import moment from 'moment'

export class DataAnalyticsHelpers {

  static analyse(current, reference, description, adjectiveOptions) {

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

  static groupCheckpointsByWeek(checkpoints) {
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
