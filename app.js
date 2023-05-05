const apiKey = "AIzaSyBwSpuOnc9bIBLFQTv-zN8toFryzpAxDbg";

window.addEventListener('load', function(){
  const map = initMap(); 
  const locationData = getEmptyLocationObj();

  document
  .getElementById("calculate")
  .addEventListener("click", function(){
    // TODO: get user input 
    const startEl = document.getElementById("start");
    const endEl = document.getElementById("end");
    const key =  document.getElementById("journey-name").value;
    
    locationData.address.start = startEl.value
    locationData.address.end = endEl.value

    // error if no start, end or car id is entered. IF STATEMENT
    Promise.all([
      getGeoData(locationData.address.start),
      getGeoData(locationData.address.end)
    ]).then(function(results){
      locationData.geodata.start= results[0];
      locationData.geodata.end = results[1];
      return updateMap(locationData.geodata.start, locationData.geodata.end, map);
      // get distance from google api
    }).then(function(distanceInKms){
      // get car id
      // target drop down.value
      locationData.distance = distanceInKms
      const carId = document.getElementById('car-dropdown').value;
      locationData.carId = carId
      // call the emission api
      // getVehicleMake()
      
      // Create VehicleModelID
      getEmission(carId, distanceInKms).then((co2) => {
        locationData.emissions = co2;
        
        saveNewJourney(key, locationData)
      })

      // 
      
    // }).then(function(calcEmissions){
    //   document.getElementById("emissions").innerHTML =
    //   "CO2e Emissions: " + calcEmissions + " g";
    //   // then put in dom PUT CARBON_KG in DOM

    });

  });


  initAutocomplete();
})

//function updateDOM()

function getEmptyLocationObj(){
  return {
    address: {
     start:"",
     end:""
    },
    geodata: {
     start:{},
     end:{}
    },
    distance: 0,
    emissions: 0,
    carId:0
 }
}

function saveNewJourney(key, locationObj){
  const saved = JSON.parse(localStorage.getItem("savedJourneys")) || {};

  if(key in saved){
    alert("this journey already exists")
    return;
  }

  saved[key] = locationObj

  localStorage.setItem("savedJourneys", JSON.stringify(saved))

  displaySaved()
}

function displaySaved(){
  const saved = JSON.parse(localStorage.getItem("savedJourneys"));
  $("#search-buttons").empty()

  for(const [key, locationObj] of Object.entries(saved)){
    const btnHTML = $(`
    <button class="mybutton" id=${key}>${key}</button>
    `)
    $("#search-buttons").append(btnHTML)
  }
}

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
        // let co2eEmissions = (distanceInKms * 197.75).toFixed(1); // swap for car data on carbon footprint
  
        // Display the distance in kilometers and CO2e emissions
        document.getElementById("distance").innerHTML =
          "Distance: " + distanceInKms.toFixed(1) + " km";
        // document.getElementById("emissions").innerHTML =
          // "CO2e Emissions: " + co2eEmissions + " g";
          resolve(distanceInKms)
        }
        else {
          reject("Could not retrieve distance");
        }
        });//make this work
  })

};

