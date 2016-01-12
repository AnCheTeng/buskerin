var myLoc = {lat: 25, lng: 121.4};
var markers = [];
var map;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: myLoc
  });

  // Add a marker to toggle Bounce
  markers.push(new google.maps.Marker({
    position: {lat: 24.9, lng: 121.4},
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Click to zoom'
  }).addListener('click', toggleBounce));

  // Show the position of the user using this webpage
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      markers.push(new google.maps.Marker({
        position: {lat: position.coords.latitude, lng: position.coords.longitude},
        map: map,
        title: 'Click to zoom'
      }).addListener('click', function() {
        map.setZoom(12);
        map.setCenter(this.getPosition());
        infoWindow.open(map, this);
      }));
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Construct a new InfoWindow.
  var infoWindow = new google.maps.InfoWindow({
    content: 'National Taiwan University'
  });

  function toggleBounce() {
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    } else {
      this.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
  }

  function drop() {
    clearMarkers();
    for (var i = 0; i < neighborhoods.length; i++) {
      addMarkerWithTimeout(neighborhoods[i], i * 200);
    }
  }

  function addMarkerWithTimeout(position, timeout) {
    window.setTimeout(function() {
      markers.push(new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP
      }));
    }, timeout);
  }

  // Clear all the markers
  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }
}
