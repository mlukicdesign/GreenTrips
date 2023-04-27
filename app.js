        //   Create the map
      function initMap() {
        let map = new google.maps.Map(document.getElementById('map'), 
        {
          center: {lat: 37.7749, lng: -122.4194},
          zoom: 13
        });

        let startMarker = new google.maps.Marker({
          map: map,
          position: {lat: 37.7749, lng: -122.4194},
          draggable: true
        });

        let endMarker = new google.maps.Marker({
          map: map,
          position: {lat: 37.7895, lng: -122.4089},
          draggable: true
        });

        let directionsService = new google.maps.DirectionsService();
        let directionsRenderer = new google.maps.DirectionsRenderer({
          map: map
        });

    let calculateRoute = function() {
  let start = startMarker.getPosition();
  let end = endMarker.getPosition();

  let request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };

  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);

      // Extract the distance value in meters from the response
      let distanceInMeters = result.routes[0].legs[0].distance.value;

      
      let distanceInKms = distanceInMeters / 1000;

      // Calculate the CO2e emissions for the distance travelled
      let co2eEmissions = (distanceInKms * 197.75).toFixed(1);
      // put the carbon_kg into above function

      // Display the distance in kilometers and CO2e emissions
      document.getElementById('distance').innerHTML = 'Distance: ' + distanceInKms.toFixed(1) + ' km';
      document.getElementById('emissions').innerHTML = 'CO2e Emissions: ' + co2eEmissions + ' g';
    }
  });
};
        document.getElementById('calculate').addEventListener('click', calculateRoute);
      }

  