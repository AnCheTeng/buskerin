function initMap() {

  var myLoc = {lat: 25, lng: 121.4};
  var markers = [];

  var map = new google.maps.Map(document.getElementById('map'), {
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

  /*
  // ============ Customed Maps ============= //
    var customMapType = new google.maps.StyledMapType([
      {
       stylers: [
         {hue: '#890000'},
         {visibility: 'simplified'},
         {gamma: 0.5},
         {weight: 0.5}
       ]
      },
      {
       elementType: 'labels',
       stylers: [{visibility: 'off'}]
      },
      {
       featureType: 'water',
       stylers: [{color: '#890000'}]
      }
      ], {
      name: 'Custom Style'
      });
    var customMapTypeId = 'custom_style';

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 9,
      center: myLoc,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
      }
    });
    map.mapTypes.set(customMapTypeId, customMapType);
    map.setMapTypeId(customMapTypeId);
  // ===================================== //
  */
  // Refocus to the maker after a period of time not focusing on the center
  /*
  map.addListener('center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the marker.
    window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 3000);
  });
  */
}
