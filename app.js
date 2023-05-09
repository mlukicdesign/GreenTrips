//  --- Global Variables ---
const apiKey = "AIzaSyBwSpuOnc9bIBLFQTv-zN8toFryzpAxDbg";

// --- Main call stack ---
window.addEventListener("load", function () {
  const map = initMap();
  const locationData = getEmptyLocationObj();
  initAutocomplete();
  displaySaved(map);
  // TODO: Load saved list on load.

  document.getElementById("calculate").addEventListener("click", function () {
    const startEl = document.getElementById("start");
    const endEl = document.getElementById("end");
    const key = document.getElementById("journey-name").value;

    locationData.address.start = startEl.value;
    locationData.address.end = endEl.value;

    // TODO: error if no start, end or car id is entered. IF STATEMENT

    // Control the function flow and pass the correct data using promise and .then
    Promise.all([
      // Store Lat and Lng by calling Geocoding API
      getGeoData(locationData.address.start),
      getGeoData(locationData.address.end),
      // Pass results so we can use in updateMap
    ])
      .then(function (results) {
        locationData.geodata.start = results[0];
        locationData.geodata.end = results[1];
        return updateMap(
          locationData.geodata.start,
          locationData.geodata.end,
          map
        );
        // Get distance from Maps api
      })
      .then(function (distanceInKms) {
        // Get car id from UI
        locationData.distance = distanceInKms;
        const carId = document.getElementById("car-dropdown").value;
        locationData.carId = carId;
        // Pass users car choice, and the journey distance to calculate co2 emissions
        getEmission(carId, distanceInKms).then((co2) => {
          locationData.emissions = co2;
          saveNewJourney(key, locationData, map);
        });
      });
  });






});

// --- Functions ---

// initialise an empty object that we fill with data to local storage
function getEmptyLocationObj() {
  return {
    address: {
      start: "",
      end: "",
    },
    geodata: {
      start: {},
      end: {},
    },
    distance: 0,
    emissions: 0,
    carId: 0,
  };
}

// dependency inject
// 
function saveNewJourney(key, locationObj, map) {
  const saved = JSON.parse(localStorage.getItem("savedJourneys")) || {};

  if (key in saved) {
    document.getElementById("distance").innerHTML =
      "This journey already exists";
      updateMap(saved[key].geodata.start, saved[key].geodata.end, map);
  } else if (key === '') {
    document.getElementById("distance").innerHTML = "Whoops! Please enter a name for your journey and try again.";
    document.getElementById("emissions").innerHTML = "Not yet my friend! You need to name this journey.";
    initMap();
  } else {
    saved[key] = locationObj;
    localStorage.setItem("savedJourneys", JSON.stringify(saved));
    displaySaved(map);
  }
}
// Use template literal to update DOM element "search-buttons" with the journey name ie the key. Use onclick to run updateMap() and pass in parameters.
function displaySaved(map) {
  const saved = JSON.parse(localStorage.getItem("savedJourneys"));
  $("#search-buttons").empty();
  console.log(saved);

  for (const journeyName in saved) {

    const locationData = saved[journeyName];
    const geoData = locationData.geodata;
    const emissionsData = locationData.emissions

    const btnHTML = $(`
    <button class="mybutton button is-medium is-rounded is-fullwidth is-success pb-3" id="${journeyName}">${journeyName}</button>
    `); 
    btnHTML.on('click', () => updateMap(geoData.start, geoData.end, map))
    $("#search-buttons").append(btnHTML);
    // document.getElementById("emissions").innerHTML =
    //   "CO2 Emissions: " + emissionsData + " g";
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
        // Get lat and lng for updateMap
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
      };
    })
    .catch(
      (error) =>
        (document.getElementById("distance").innerHTML =
          "Error: Please enter two valid destinations within Australia")
    );
}

//   Create the map
function initMap() {
  return new google.maps.Map(document.getElementById("map"), {
    mapId: "8b89d38def86103e",
    center: { lat: -31.953512, lng: 115.857048 },
    zoom: 13,
  });
}
// Run the Maps API 
let markers = [];
function updateMap(geoDataStart, geoDataEnd, map) {
  


  return new Promise(function (resolve, reject) {

    markers.forEach(function(marker){
      console.log('heya')
      marker.setMap(null);
    });
    markers = [];
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
    markers.push(startMarker, endMarker);

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

        // Extract the distance value in km from the response then pass it out as the resolve
        let distanceInMeters = result.routes[0].legs[0].distance.value;
        let distanceInKms = distanceInMeters / 1000;
        // Display the distance in kilometers in DOM
        document.getElementById("distance").innerHTML =
          "Distance: " + distanceInKms.toFixed(1) + " km";
        resolve(distanceInKms);
      } else {
        reject("Could not retrieve distance");
      }
    });
  });
}
