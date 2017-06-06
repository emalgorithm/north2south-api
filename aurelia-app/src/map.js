exports.startMap = function() {
  window.initMap = initMap;

  // Add script which loads the map, and then has a callback to initMap
  let scriptElement = document.createElement('script');
  scriptElement.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAXwYqFZxpik8C0iIJgwuTroW1KyCSX_jk&callback=initMap";
  scriptElement.async = true;
  scriptElement.defer = true;
  scriptElement.onload = () => {
    console.log("Google maps script element has been loaded");
  };
  document.querySelector('head').appendChild(scriptElement);
};

var labelIndex = 0;

function initMap() {
  // In the following example, markers appear when the user clicks on the map.

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng, map);
  });
}

// Adds a marker to the map.
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: labelIndex++,
    map: map
  });
}
