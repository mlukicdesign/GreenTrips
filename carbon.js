let cars = [];
let fuel = [];
const carDropdown = document.getElementById('car-dropdown');

fetch("https://www.carboninterface.com/api/v1/vehicle_makes", {
  method: "GET",
  headers: {
    Authorization: "Bearer 6QeGE5VqAKrw1NYnUNp8Q",
    "Content-Type": "application/json",
  },
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    data.forEach(function (vehicle) {
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

const requestBody = {
  type: "vehicle",
  distance_unit: "km",
  distance_value: 100,
  vehicle_model_id: "7268a9b7-17e8-4c8d-acca-57059252afe9",
};

const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer 6QeGE5VqAKrw1NYnUNp8Q",
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
    fuel.push(fuelType);
  })
  .catch(function (error) {
    console.error(error);
  });
// console.log(fuel);
// console.log(cars);

let carData = JSON.parse(localStorage.getItem("cars"))

for (let i = 0; i < carData.length; i++) {
  const option = document.createElement('option');
  option.value = carData[i].ID;
  option.textContent = `${carData[i].name}`;
  carDropdown.appendChild(option);
  console.log(carData[i]);
  console.log(carData[i].name);
}

