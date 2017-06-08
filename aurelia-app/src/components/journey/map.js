export class Map {
  constructor() {
    Logger.info("Inside Map constructor");
    this.labelIndex = 0;
    this.coordinates = [];
  }

  activate() {
    Logger.info("Inside Map attached() method");
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
      Logger.info("Inside initMap, GoogleMap is: ");
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
      Logger.info("Google maps script element has been loaded");
    };
    document.querySelector('head').appendChild(scriptElement);
  }

  addMarker(latitude, longitude) {
    if(isNaN(latitude) || isNaN(longitude)) {
      return;
    }

    Logger.info("Adding a marker at latitude: " + latitude + " and longitude: " + longitude);
    Logger.info("GoogleMap is: ");
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
    Logger.info("drawPath is being called")
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
