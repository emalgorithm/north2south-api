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
      google.charts.setOnLoadCallback(this.drawChart());
    }.bind(this));
  }

  drawChart() {
    return (function() {
      Logger.info("Drawing chart: " + this.name);
      var data = google.visualization.arrayToDataTable([
        ["Day", this.name],
        ['03', 2000],
        ['04', 3170],
        ['05', 2660],
        ['06', 3030],
        ['07', 2730]
      ]);

      var options = {
        chart: {
          title: 'Calories burnt',
        }
      };

      var chart = new google.charts.Bar(document.getElementById(this.name));

      chart.draw(data, google.charts.Bar.convertOptions(options));
    }.bind(this));
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
