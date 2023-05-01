

function callCars () {

let cars = [];
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
    data.forEach(function(data) {
      cars.push(data.data.attributes.name);
      console.log(data);
      console.log(data.data.attributes.name);
      localStorage.setItem("cars", JSON.stringify(cars));
    });
  })
  .catch(function(error) {
    console.error(error);
  });

  console.log(data);

}

callCars()