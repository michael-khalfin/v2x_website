let map;
let marker1, marker2;
let objectMarkers = [];

function addOrUpdateMarker(marker, position, map, icon) {
  if (marker) {
    marker.setMap(null);
  }
  marker = new google.maps.Marker({
    position: position,
    map: map,
    icon: icon
  });
  return marker;
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 30,
    center: { lat: 42.472313, lng: -83.250034 },
    mapTypeId: 'satellite' // Added satellite view
  });

  const socket = io('http://10.42.0.1:3000');

  socket.on('newLocation1', function(data) {
    const position = new google.maps.LatLng(data.latitude, data.longitude);
    marker1 = addOrUpdateMarker(marker1, position, map, 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
  });

  socket.on('newLocation2', function(data) {
    const position = new google.maps.LatLng(data.latitude, data.longitude);
    marker2 = addOrUpdateMarker(marker2, position, map, 'http://maps.google.com/mapfiles/ms/icons/green-dot.png');
  });

  socket.on('newObjectLocations', function(locations) {
    objectMarkers.forEach(marker => marker.setMap(null));
    objectMarkers = [];

    locations.forEach(location => {
      const newMarker = new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
      });
      objectMarkers.push(newMarker);
    });
  });
}

initMap();

