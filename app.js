
const apiKey = 'AIzaSyBwSpuOnc9bIBLFQTv-zN8toFryzpAxDbg';
const startEl = document.getElementById('start')
const endEl = document.getElementById('end')
let startLatitudeStart, endLongitudeStart, startLatitudeEnd, endLongitudeEnd;
// let startInput = startEl.value
// let endInput = endEl.value
const startInput = '1600 Amphitheatre Parkway, Mountain View, CA';
const endInput = '1159 N Rengstorff Ave, Mountain View, CA';


function getStartData(startInput, apiKey) {
  let geocodingStartApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(startInput)}&key=${apiKey}`;

  fetch(geocodingStartApiUrl)
    .then(response => response.json())
    .then(data => {
      let startLatitudeStart = data.results[0].geometry.location.lat;
      let endLongitudeStart = data.results[0].geometry.location.lng;
      console.log(startLatitudeStart, endLongitudeStart);
    })
    .catch(error => console.error(error));
}
function getEndData(endInput, apiKey) {
  let geocodingEndApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endInput)}&key=${apiKey}`;

  fetch(geocodingEndApiUrl)
    .then(response => response.json())
    .then(data => {
      let startLatitudeEnd = data.results[0].geometry.location.lat;
      let endLongitudeEnd = data.results[0].geometry.location.lng;
      console.log(startLatitudeEnd, endLongitudeEnd);

    })
    .catch(error => console.error(error));
} 

//   Create the map
function initMap() {
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.4223878, lng: -122.0841877 },
    zoom: 13,
  });}

  function updateMap(startLatitudeStart, endLongitudeStart) {
  
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
  
    function calculateRoute() {
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
  }
    // When clicked run the co2 calculator
  
  function fetchDataAndCalculateRoute() {
    getStartData(startInput, apiKey);
    getEndData(endInput, apiKey);
    updateMap(startLatitudeStart, endLongitudeStart)}
    
  
  
  fetchDataAndCalculateRoute(startInput, apiKey, endInput, startLatitudeStart, endLongitudeStart);
  

  
  // document
  //   .getElementById("calculate")
  //   .addEventListener("click", fetchDataAndCalculateRoute);
  
