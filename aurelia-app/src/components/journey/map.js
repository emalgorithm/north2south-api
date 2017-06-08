function startMap() {
  window.initMap = initMap;

  addMapScript()
};

function addMapScript() {
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

var labelIndex = 0;
var map = null;
var coordinates = []

function initMap() {
  // In the following example, markers appear when the user clicks on the map.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 2
  });

}

// Adds a marker to the map.
function addMarker(latitude, longitude) {
  if(isNaN(latitude) || isNaN(longitude)) {
    return;
  }

  Logger.info("Adding a marker at latitude: " + latitude + " and longitude: " + longitude);

  var location = new google.maps.LatLng(latitude, longitude);

  var marker = new google.maps.Marker({
    position: location,
    label: labelIndex.toString(),
    map: map
  });

  labelIndex++;

  coordinates.push({
    lat: latitude,
    lng: longitude
  })

  drawPath()
}

function drawPath() {
  Logger.info("drawPath is being called")
  Logger.info(coordinates)
  var path = new google.maps.Polyline({
    path: coordinates,
    geodesic: true,
    strokeColor: '#ff4f4a',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  path.setMap(map);
}

exports.startMap = startMap;
exports.addMarker = addMarker;
