var myLoc = {lat: 25.019818307021946, lng: 121.54214659134442};
var markers = [];
var map;
var infoWindowww;

function initMap() {

  var locations = [
       ['A', 25, 121.4, 4],
       ['B', 25, 121.41, 5],
       ['C', 25, 121.43, 3],
       ['D', 25, 121.47, 2],
       ['E', 25, 121.5, 1]
     ];

   var map = new google.maps.Map(document.getElementById('map'), {
     zoom: 10,
     center: new google.maps.LatLng(25.019818307021946, 121.54214659134442),
     mapTypeId: google.maps.MapTypeId.ROADMAP
   });

   var infowindow = new google.maps.InfoWindow();

   var marker, i;

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

  // // Show the position of the user using this webpage
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent('NTU');
          infowindow.open(map, marker);
        }
      })(marker, i));
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Add a marker to toggle Bounce
  // markers.push(new google.maps.Marker({
  //   position: {lat: 25, lng: 121.5},
  //   map: map,
  //   animation: google.maps.Animation.DROP,
  //   title: 'Click to zoom'
  // }).addListener('click', toggleBounce));
}

function createInfoWindowForBuskers(){
  var i, lengt=10;
  for(i=0; i<length; i++) {
    infoWindows[i] = createInfoWindow(i);
  }
}

function createInfoWindow(information){
  return new google.maps.InfoWindow({
    content: information
  });
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
