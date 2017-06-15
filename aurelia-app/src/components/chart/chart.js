import { customElement, decorators, bindable } from 'aurelia-framework';
import { BindingEngine } from 'aurelia-framework';
import 'material-dashboard'
import moment from 'moment'
import Chartist from 'chartist'

export const Chart = decorators(
  customElement('chart'),
  bindable('data'),
  bindable('title'),
  bindable('analyser'),
  bindable('dataProperty')
).on(
  class {

    static inject =[BindingEngine]
    subscription = null
    liveData = []

    constructor(bindingEngine) {

      this.options = ['Week', 'Live', 'All']
      this.selection = this.options[0]
      
      this.bindingEngine = bindingEngine
      this.data = []

      this.propertySubscription = this.bindingEngine.propertyObserver(this, 'data')
        .subscribe(this.dataChanged.bind(this))
    }

    dataChanged(newValue, oldValue) {
      this.unsubscribe()
      if (this.data) {
        this.subscription = this.bindingEngine.collectionObserver(this.data)
        .subscribe(this.dataMutated.bind(this))
      }
    }

    dataMutated(splices) {
      debugger
      let liveDataLength = this.liveData.length
      for (let splice of splices) {
        this.liveData.push(this.data[splice.index])
      }
    
      if (this.selection === 'Live') {
        if (liveDataLength > 0) {
          this.liveChart.update(this.dataAsSeries(this.liveData))
        } else {
          this.showLiveChart()
        }
      }
      this.analysis = this.analyser.analysis()
    }

    unsubscribe() {
      if (this.subscription) {
        this.subscription.dispose()
        this.subscription = null
      }
    }

    unbind() {
      this.unsubscribe()
      this.propertySubscription.dispose()
    }

    attached() {
      this.analysis = this.analyser.analysis()
      this.selectOption(this.selection)
    }

    get name() {
      return this.title.split(' ').join('-')
    }

    selectOption(option) {
      this.selection = option
      switch (option) {
        case 'Week':
          this.showWeekChart();
          break;
        case 'All':
          this.showAllChart();
          break;
        case 'Live':
          if (this.liveData.length > 0) {
            this.showLiveChart();            
          }
          break;  
      }
    }

    showWeekChart() {
      let limit = 15 // Margin for vertical axis

      let groups = this.data.reduce(function(cs, c) {
        (cs[moment(c.createdAt).format('MMM DD')] = cs[moment(c.createdAt).format('MMM DD')] || []).push(c);
        return cs;
      }, {});

      let propertyData = this.getGraphData(groups, this.dataProperty, this.analyser.valueFunction)


      let options = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: Math.min.apply(Math, propertyData.series[0].filter(x => !isNaN(x) && x !== null)) - limit,
        high: Math.max.apply(Math, propertyData.series[0].filter(x => !isNaN(x) && x !== null)) + limit,
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
      };

      let chart = new Chartist.Line(`.chart-${this.name}-Week`, propertyData, options);

      md.startAnimationForLineChart(chart);
    }

    dataAsSeries(xs) {
      let data = xs.map((c) => {
        return {
          x: moment(c.createdAt).toDate(),
          y: c[this.dataProperty]
        }
      })

      let series = [{
        name: this.dataProperty + 'Series',
        data: data
      }]

      return { series: series }
    }

    showLiveChart() {
      let data = this.dataAsSeries(this.liveData)

      let options = {
        lineSmooth: false,
        axisX: {
          type: Chartist.FixedScaleAxis,
          divisor: 10,
          labelInterpolationFnc: function(value) {
            return moment(value).format('hh:mm::ss')
          }
        }
      }

      this.liveChart = new Chartist.Line(`.chart-${this.name}-Live`, data, options)

      md.startAnimationForLineChart(this.liveChart)
    }

    showAllChart() {
      let data = this.dataAsSeries(this.data)

      let options = {
        lineSmooth: false,
        axisX: {
          type: Chartist.FixedScaleAxis,
          divisor: 7,
          labelInterpolationFnc: function(value) {
            return moment(value).format('MMM DD')
          }
        }
      }

      let chart = new Chartist.Line(`.chart-${this.name}-All`, data, options)

      md.startAnimationForLineChart(chart)
    }

    getGraphData(groups, field, choose) {
      let dataAndDates = []

      for (let property in groups) {
        if (groups.hasOwnProperty(property)) {
          let data = groups[property].map(function(a) { return a[field]; })
          dataAndDates.push([property, choose(data)]);
        }
      }

      let dateLabels = []
      let dataSeries = []

      if (dataAndDates.length > 0) {
        dateLabels.push(dataAndDates[0][0])
        dataSeries.push(dataAndDates[0][1])
        let current = 1;
        let lastDate = dataAndDates[0][0]
        for (let i = 1; i < 7; i++) {
          if (current < dataAndDates.length && this.isNext(dataAndDates[current][0], lastDate)) {
            dateLabels.push(dataAndDates[current][0])
            dataSeries.push(dataAndDates[current][1])
            lastDate = dataAndDates[current][0]
            current += 1
          } else {
            lastDate = moment(lastDate, 'MMM/DD', false).add(-1, 'days').format('MMM DD')
            dateLabels.push(lastDate)
            dataSeries.push(undefined)
          }
        }
      } else {
        /* This week's days with no data */
        for (let i = this.displayedDays - 1; i >= 0; i--) {
          dateLabels.push(moment().add(-i, 'days').format('MMM DD'))
        }
      }

      return {
        labels: dateLabels.reverse(),
        series: [dataSeries.reverse()]
      };
    }

    isNext(d1, d2) {
      return moment(d2, 'MMM/DD', false).diff(moment(d1, 'MMM/DD', false), 'days') == 1
    }
  }
)