let fuel = [];
const carDropdown = document.getElementById('car-dropdown');
const carbonAPI = "4D3Nv3DJWT2MkTgxdeClnA";

// Use data collected to run a custom API call
function getEmission(carId, distanceInKms) {
  const requestBody = {
    type: "vehicle",
    distance_unit: "km",
    distance_value: distanceInKms,
    vehicle_model_id: carId,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + carbonAPI,
  };

  return fetch("https://www.carboninterface.com/api/v1/estimates", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let fuelType = {
        carbonOutput: data.data.attributes.carbon_kg,
        fuelID: data.data.id,
      };
      document.getElementById("emissions").innerHTML =
      "CO2 Emissions: " + fuelType.carbonOutput + " g";
      fuel.push(fuelType);
      return fuelType.carbonOutput
    })
    .catch(function (error) {
      console.error(error);
    });
}


