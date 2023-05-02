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

  console.log(data);

}



