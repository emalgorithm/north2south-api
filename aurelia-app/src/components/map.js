import { EventAggregator } from 'aurelia-event-aggregator';

export class Map {

  static inject = [EventAggregator];

  constructor(EventAggregator) {
    console.log("Inside Map constructor");
    this.eventAggregator = EventAggregator;
    this.labelIndex = 0;
    this.coordinates = [];
  }

  activate() {
    console.log("Inside Map attached() method");
    window.initMap = this.initMap();

    this.addMapScript()
  }

  initMap() {
    // In the following example, markers appear when the user clicks on the map.
    return (function() {
      this.googleMap = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 2
      });
      console.log("Inside initMap, GoogleMap is: ");
      console.log(this);
    }.bind(this));
  }

  addMapScript() {
    // Add script which loads the map, and then has a callback to initMap
    let scriptElement = document.createElement('script');
    scriptElement.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAXwYqFZxpik8C0iIJgwuTroW1KyCSX_jk&callback=initMap";
    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.onload = () => {
      console.log("Google maps script element has been loaded");
      this.eventAggregator.publish("mapLoaded", this);
    };
    document.querySelector('head').appendChild(scriptElement);
  }

  addMarker(latitude, longitude) {
    if(isNaN(latitude) || isNaN(longitude)) {
      return;
    }

    console.log("Adding a marker at latitude: " + latitude + " and longitude: " + longitude);
    console.log("GoogleMap is: ");
    console.log(this.googleMap);

    var location = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
      position: location,
      label: this.labelIndex.toString(),
      map: this.googleMap
    });

    this.labelIndex++;

    this.coordinates.push({
      lat: latitude,
      lng: longitude
    });

    this.drawPath()
  }

  drawPath() {
    console.log("drawPath is being called")
    var path = new google.maps.Polyline({
      path: this.coordinates,
      geodesic: true,
      strokeColor: '#ff4f4a',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    path.setMap(this.googleMap);
  }
}
