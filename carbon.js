// const apiKey = "6QeGE5VqAKrw1NYnUNp8Q";
let cars = [];
let fuel = [];

fetch("https://www.carboninterface.com/api/v1/vehicle_makes", {
  method: "GET",
  headers: {
    Authorization: "Bearer 6QeGE5VqAKrw1NYnUNp8Q",
    "Content-Type": "application/json",
  }
})
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Store the IDs of the vehicle makes
    data.forEach(function(vehicle) {
      let carNameandID = {
       "name": vehicle.data.attributes.name,
       "ID": vehicle.data.id,
      }
        cars.push(carNameandID)
      // console.log(vehicle);
      // console.log(data.data.attributes.name);
      // console.log(data.data.attributes.carbon_kg);

      localStorage.setItem("cars", JSON.stringify(carNameandID));
    });
    
  })
  .catch(function(error) {
    console.error(error);
  });
  // console.log(carsID);



// Define the endpoint URL and API key



// Define the request body
const requestBody = {
      "type": "vehicle",
      "distance_unit": "km",
      "distance_value": 100,
      "vehicle_model_id": "7268a9b7-17e8-4c8d-acca-57059252afe9"
};

// Define the API request headers
const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer 6QeGE5VqAKrw1NYnUNp8Q"
};

// Make the API request and log the response
fetch("https://www.carboninterface.com/api/v1/estimates", {
  method: "POST",
  headers: headers,
  body: JSON.stringify(requestBody)
})
.then(function(response) {
  return response.json();
})
.then(function(data) {
  let fuelType = {
  "carbonOutput": data.data.attributes.carbon_kg,
  "fuelID": data.data.id,
}
  fuel.push(fuelType)
})
.catch(function(error) {
  console.error(error);
});
console.log(fuel);
console.log(cars);

