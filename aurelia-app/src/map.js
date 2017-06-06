exports.startMap = function() {
  // Add script for initMap function code
  let initMapScriptElement = document.createElement('script');
  initMapScriptElement.textContent = `var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      });
    }
    `;
  document.querySelector('head').appendChild(initMapScriptElement);
  initMapScriptElement.onload = () => {
    console.log("Init Map script element has been loaded");
  };

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
