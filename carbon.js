let cars = [];
let fuel = [];
const carDropdown = document.getElementById('car-dropdown');

// Get Vehicle Made ID

function getVehicleMake () {
fetch("https://www.carboninterface.com/api/v1/vehicle_makes", {
  method: "GET",
  headers: {
    Authorization: "Bearer Y6YfKnrXdr0PVQgyBvnyw",
    "Content-Type": "application/json",
  },
})
  .then(function (response) {
    return response.json();

  })
  .then(function (data) {
    data.forEach(function (vehicle) {
      // console.log(vehicle)
      let carNameandID = {
        name: vehicle.data.attributes.name,
        ID: vehicle.data.id,
      };
      cars.push(carNameandID);
    });
    localStorage.setItem("cars", JSON.stringify(cars));
    

  })
  .catch(function (error) {
    console.error(error);
  });
}

// Vehicle model request

function getVehicleModel (carID) {
  fetch(`https://www.carboninterface.com/api/v1/vehicle_makes/${carID}/vehicle_models`, {
    method: "GET",
    headers: {
      Authorization: "Bearer Y6YfKnrXdr0PVQgyBvnyw",
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
  
    })
    .then(function (data) {
      data(function (vehicleModel) {
        console.log(vehicleModel)
      });
     });

    }








  let carData = JSON.parse(localStorage.getItem("cars"))

  // for (let i = 0; i < carData.length; i++) {
  //   const option = document.createElement('option');
  //   option.value = carData[i].ID;
  //   option.textContent = `${carData[i].name}`;
  //   carDropdown.appendChild(option);
  //   console.log(carData[i]);
  //   console.log(carData[i].name);
  // }

// we need to make this a function. we need to store distanceInKm in distance_value
function getEmission(carId, distanceInKms) {
  const requestBody = {
    type: "vehicle",
    distance_unit: "km",
    distance_value: distanceInKms,
    vehicle_model_id: carId,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer Y6YfKnrXdr0PVQgyBvnyw",
  };

  fetch("https://www.carboninterface.com/api/v1/estimates", {
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
      "CO2e Emissions: " + fuelType.carbonOutput + " g";
      fuel.push(fuelType);
      console.log('Fuel Type',fuelType);
      let c02 = fuelType.carbonOutput
      console.log(c02)
      return c02
    })
    .catch(function (error) {
      console.error(error);
    });
    // console.log(fuel);
    // console.log(cars);
    

}


