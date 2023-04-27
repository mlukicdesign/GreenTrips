let cars = [];
fetch("https://www.carboninterface.com/api/v1/vehicle_makes", {
  method: "GET",
  headers: {
    Authorization: "Bearer 6QeGE5VqAKrw1NYnUNp8Q",
    "Content-Type": "application/json"
  },
})
  .then(response => response.json())
  .then(data => {
    // Store the IDs of the vehicle makes
    data.forEach(data => {
      cars.push(data.id);
      localStorage.setItem("cars", JSON.stringify(cars));
    });
    console.log(data);
    console.log(cars); // Log the cars array
  })
  .catch(error => console.error(error));





