export class BarChart {
  constructor() {
    this.addChartScript(this.loadChart());
  }

  activate(model) {
    Logger.info("In BarChart activate() method");
    this.name = model.chartName;
  }

  attached() {
    Logger.info("In BarChart attached() method");
  }

  loadChart() {
    return (function () {
      google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(this.drawChart);
    }.bind(this));
  }

  drawChart() {
    Logger.info("Drawing chart");
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Sales', 'Expenses', 'Profit'],
      ['2014', 1000, 400, 200],
      ['2015', 1170, 460, 250],
      ['2016', 660, 1120, 300],
      ['2017', 1030, 540, 350]
    ]);

    var options = {
      chart: {
        title: 'Company Performance',
        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      }
    };

    var chart = new google.charts.Bar(document.getElementById('calories'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
  }

  addChartScript(callback) {
    // Add script which loads the map, and then has a callback to initMap
    Logger.info("Inserting chart script into dom");
    let scriptElement = document.createElement('script');
    scriptElement.src = "https://www.gstatic.com/charts/loader.js";
    scriptElement.onload = () => {
      Logger.info("Google Chart script element has been loaded");
      callback()
    };
    document.querySelector('head').appendChild(scriptElement);
  }
}
