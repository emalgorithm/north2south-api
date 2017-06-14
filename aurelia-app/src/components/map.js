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
    this.addMapScript(this.initMap())
  }

  initMap() {
    // In the following example, markers appear when the user clicks on the map.
    return (function() {
      this.googleMap = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 2
      });
    }.bind(this));
  }

  addMapScript(callback) {
    // Add script which loads the map, and then has a callback to initMap
    let scriptElement = document.createElement('script');
    scriptElement.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAXwYqFZxpik8C0iIJgwuTroW1KyCSX_jk";
    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.onload = () => {
      console.log("Google maps script element has been loaded");
      callback();
      this.eventAggregator.publish("mapLoaded", this);
    };
    document.querySelector('head').appendChild(scriptElement);
  }

  addMarker(latitude, longitude) {
    this.addMarkerWithLabel(latitude, longitude, this.labelIndex.toString());

    this.labelIndex++;

    this.coordinates.push({
      lat: latitude,
      lng: longitude
    });

    this.drawPath()
  }

  addDestination(latitude, longitude) {
    this.addMarkerWithLabel(latitude, longitude, "Destination")
  }

  addMarkerWithLabel(latitude, longitude, label) {
    if(!this.isLatitudeValid(latitude) || !this.isLongitudeValid(longitude)) {
      return;
    }

    console.log("Adding a marker at latitude: " + latitude + " and longitude: " + longitude + " and label: " + label);

    var location = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
      position: location,
      label: label,
      map: this.googleMap
    });
  }

  isLatitudeValid(latitude) {
    return !isNaN(latitude) && latitude <= 90 && latitude >= -90;
  }

  isLongitudeValid(longitude) {
    return !isNaN(longitude) && longitude <= 180 && longitude >= -180;
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

  setOptions(options) {
    this.googleMap.setOptions(options)
  }

}
