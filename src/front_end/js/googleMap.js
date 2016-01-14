var map;
var infoWindowww;
var myLoc = {lat: 25.019818307021946, lng: 121.54214659134442};
var infowindow = new google.maps.InfoWindow();
var marker, i, k;
var locations = [];
var length, lengthLoc, lengthLocFavorite;

var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

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
    navigator.geolocation.getCurrentPosition(success,error);
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function success(position) {
  myLoc.lat = position.coords.latitude;
  myLoc.lng = position.coords.longitude;
  console.log('myLoc lat: ' + myLoc.lat);
  console.log('myLoc lng: ' + myLoc.lng);

  marker = new google.maps.Marker({
    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    map: map,
    icon: iconBase + 'schools_maps.png'
  });

  google.maps.event.addListener(marker, 'click', (function(marker, i) {
    return function() {
      map.setZoom(14);
      map.setCenter(marker.getPosition());
      infowindow.setContent(account_name);
      infowindow.open(map, marker);
    }
  })(marker, i));

  $.ajax('http://'+ targetIP + '/busker/locate', {
    type: 'POST',
    data: {
      "busker_Id": account_busker_Id,
      "busker_lat": myLoc.lat,
      "busker_long": myLoc.lng
    },
    success: function(result) {
      if(result == 0) {
        console.log("Successfully save your location");
      } else {
        console.log("Fail to save your location");
      }
    }
  });
};

function showAllBuskersOnMap() {

  var shouldAdd;
  locations = [];

  console.log('showAllBuskersOnMap');
  $.ajax('http://'+ targetIP + '/busker/locateAllBuskers', {
    type: 'GET',
    success: function(result) {
      console.log(result);
      console.log(result.length);
      if(result !== undefined) {
        for(i=0, length=result.length; i<length; i++) {
          shouldAdd = true;
          var newName = result[i].performer_name;
          lengthLoc=locations.length;
          if(lengthLoc !== 0) {
            for(k=0; k<lengthLoc; k++) {
              if(locations[k][0] == newName && shouldAdd === true) {
                shouldAdd = false;
              }
            }
          }
          if(shouldAdd == true)
            locations.push([result[i].performer_name, parseFloat(result[i].lat), parseFloat(result[i].long)]);

          if(i==length-1)
            showMarkers();
        }
      }
    }
  });
}

function showAllFavoriteBuskersOnMap() {

  locations = [];
  lengthLocFavorite=account_favorate_list.length;

  for(i=0; i<lengthLocFavorite; i++) {
    if(account_favorate_list[i].lat !== "") {
      console.log('performance name: ' + account_favorate_list[i].performer_name);
      console.log('performance lat: ' + account_favorate_list[i].lat);
      console.log('performance lng: ' + account_favorate_list[i].long);
      locations.push([account_favorate_list[i].performer_name, parseFloat(account_favorate_list[i].lat), parseFloat(account_favorate_list[i].long)]);
    }
    if(i==lengthLocFavorite-1) {
      showMarkers();
    }
  }
}


function showMarkers() {

  console.log("showMarkers");

  for(k=0, lengthLoc=locations.length; k<lengthLoc; k++) {
    console.log(locations[k]);
  }

  for (i = 0; i < locations.length; i++) {
   marker = new google.maps.Marker({
     position: new google.maps.LatLng(locations[i][1], locations[i][2]),
     map: map
   });

   google.maps.event.addListener(marker, 'click', (function(marker, i) {
     return function() {
       map.setZoom(14);
       map.setCenter(marker.getPosition());
       infowindow.setContent(locations[i][0]);
       infowindow.open(map, marker);
     }
   })(marker, i));
  }
}

function error() {
  console.error('Error');
};

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
