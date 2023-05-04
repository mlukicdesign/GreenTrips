const apiKey = "AIzaSyBwSpuOnc9bIBLFQTv-zN8toFryzpAxDbg";

window.addEventListener('load', function(){
  const map = initMap(); 
  
  document
  .getElementById("calculate")
  .addEventListener("click", function(){
    // TODO: get user input 
    initAutocomplete();
    const startEl = document.getElementById("start");
    const endEl = document.getElementById("end");
    let startInput = startEl.value
    let endInput = endEl.value
    const userCarSelectionEl = document.getElementById("car-dropdown");
    let userCarSelection = userCarSelectionEl.value
    Promise.all([
      getGeoData(startInput),
      getGeoData(endInput),
      getEmissionData(userCarSelection)
    ]).then(function(results){
      const geoDataStart = results[0];
      const geoDataEnd = results[1];
      return updateMap(geoDataStart, geoDataEnd, map);
      // get distance from google api
    }).then(function(distanceInKms){
      // get car id
      // target drop down.value
      const carId = document.getElementById.value;
      // call the emission api
      return getEmission(carId, distanceInKms)
      
    }).then(function(calcEmissions){
      // then put in dom

    });

  });
})



function getGeoData(address) {
  let geocodingStartApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
    )}&key=${apiKey}`;
    
  return fetch(geocodingStartApiUrl)
  .then((response) => response.json())
  .then((data) => {
      return {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
      };
    })
    .catch((error) => document.getElementById("distance").innerHTML =
    "Error: Please enter two valid destinations within the United States");
}

//   Create the map
function initMap() {
  return new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.4223878, lng: -122.0841877 },
    zoom: 13,
  });
}

function updateMap(geoDataStart, geoDataEnd, map) {

  return new Promise(function(resolve, reject){

    let startMarker = new google.maps.Marker({
      map: map,
      position: geoDataStart,
      draggable: true,
    });
  
    let endMarker = new google.maps.Marker({
      map: map,
      position: geoDataEnd,
      draggable: true,
    });
  
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
    });
  
    let request = {
      origin: geoDataStart,
      destination: geoDataEnd,
      travelMode: "DRIVING",
    };
  
    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(result);
  
        // Extract the distance value in meters from the response
        let distanceInMeters = result.routes[0].legs[0].distance.value;
  
        let distanceInKms = distanceInMeters / 1000;
  
        // Calculate the CO2e emissions for the distance travelled
        let co2eEmissions = (distanceInKms * 197.75).toFixed(1); // swap for car data on carbon footprint
  
        // Display the distance in kilometers and CO2e emissions
        document.getElementById("distance").innerHTML =
          "Distance: " + distanceInKms.toFixed(1) + " km";
        document.getElementById("emissions").innerHTML =
          "CO2e Emissions: " + co2eEmissions + " g";
             }
          resolve});//make this work
  })

};

