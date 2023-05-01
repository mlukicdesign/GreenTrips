
const apiKey = 'AIzaSyBwSpuOnc9bIBLFQTv-zN8toFryzpAxDbg';
const startEl = document.getElementById('start')
const endEl = document.getElementById('end')
let startLatitude, startLongitude, endLatitude, endLongitude;

// let startInput = startEl.value
// let endInput = endEl.value
const startInput = '1600 Amphitheatre Parkway, Mountain View, CA';
const endInput = '1159 N Rengstorff Ave, Mountain View, CA';

function getStartData(startInput, apiKey) {
  let geocodingStartApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    startInput
  )}&key=${apiKey}`;

  return fetch(geocodingStartApiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Get the latitude and longitude of the first result
      startLatitude = data.results[0].geometry.location.lat;
      startLongitude = data.results[0].geometry.location.lng;
    });
}

// Get the latitude and longitude of the end location using the Google Maps Geocoding API
function getEndData(endInput, apiKey) {
  let geocodingEndApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    endInput
  )}&key=${apiKey}`;

  return fetch(geocodingEndApiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Get the latitude and longitude of the first result
      endLatitude = data.results[0].geometry.location.lat;
      endLongitude = data.results[0].geometry.location.lng;
    });
}

//   Create the map
function initMap() {
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.4223878, lng: -122.0841877 },
    zoom: 13,
  });}


  function updateMap(startLatitudeStart, endLongitudeStart, startLatitudeEnd, endLongitudeEnd) {
  
    let startMarker = new google.maps.Marker({
      map: map,
      position: { lat: startLatitudeStart, lng: endLongitudeStart },
      draggable: true,
    });
  
    let endMarker = new google.maps.Marker({
      map: map,
      position: { lat: startLatitudeEnd, lng: endLongitudeEnd },
      draggable: true,
    });
  
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
    });
  
    let calculateRoute = function () {
      let start = startMarker.getPosition();
      let end = endMarker.getPosition();
  
      let request = {
        origin: start,
        destination: end,
        travelMode: "DRIVING",
      };
  
      directionsService.route(request, function (result, status) {
        if (status == "OK") {
          directionsRenderer.setDirections(result);
  
          // Extract the distance value in meters from the response
          let distanceInMeters = result.routes[0].legs[0].distance.value;
  
          let distanceInKms = distanceInMeters / 1000;
  
          // Calculate the CO2e emissions for the distance travelled
          let co2eEmissions = (distanceInKms * 197.75).toFixed(1);// swap for car data on carbon footprint
  
          // Display the distance in kilometers and CO2e emissions
          document.getElementById("distance").innerHTML =
            "Distance: " + distanceInKms.toFixed(1) + " km";
          document.getElementById("emissions").innerHTML =
            "CO2e Emissions: " + co2eEmissions + " g";
        }
      });
    };
  
    // When clicked run the co2 calculator
    calculateRoute();
  }
  
  function fetchDataAndCalculateRoute() {
    getStartData(startInput, apiKey);
    getEndData(endInput, apiKey);
  }
  
  fetchDataAndCalculateRoute();


  
  // document
  //   .getElementById("calculate")
  //   .addEventListener("click", fetchDataAndCalculateRoute);
  
