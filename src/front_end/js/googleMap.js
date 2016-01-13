var map;
var infoWindowww;
var myLoc = {lat: 25.019818307021946, lng: 121.54214659134442};
var infowindow = new google.maps.InfoWindow();
var marker, i;
var locations = [
     ['A', 25, 121.4, 4],
     ['B', 25, 121.41, 5],
     ['C', 25, 121.43, 3],
     ['D', 25, 121.47, 2],
     ['E', 25, 121.5, 1]
   ];

function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     zoom: 12,
     center: new google.maps.LatLng(myLoc.lat, myLoc.lng),
     mapTypeId: google.maps.MapTypeId.ROADMAP
   });
}

function showYourPosByMarker(account_name) {

  console.log('showYourPosByMarker');
  // // Show the position of the user using this webpage
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      myLoc.lat = position.coords.latitude;
      myLoc.lng = position.coords.longitude;

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(account_name);
          infowindow.open(map, marker);
        }
      })(marker, i));
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function showMarkers() {

  console.log('showMarkers');

  for (i = 0; i < locations.length; i++) {
   marker = new google.maps.Marker({
     position: new google.maps.LatLng(locations[i][1], locations[i][2]),
     map: map
   });

   google.maps.event.addListener(marker, 'click', (function(marker, i) {
     return function() {
       infowindow.setContent(locations[i][0]);
       infowindow.open(map, marker);
     }
   })(marker, i));
  }
}

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

// google.maps.event.addDomListener(window, 'load', initMap);
