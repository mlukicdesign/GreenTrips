function initAutocomplete() {
    // Create the Autocomplete objects for start and end inputs
    let startAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById("start"),
      {
        types: ["establishment"],
        componentRestrictions: { country: ["US"] },
        fields: ["place_id", "geometry", "name"],
      }
    );
    let endAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById("end"),
      {
        types: ["establishment"],
        componentRestrictions: { country: ["US"] },
        fields: ["place_id", "geometry", "name"],
      }
    );
  
    // Attach the event listeners for start and end inputs
    startAutocomplete.addListener("place_changed", onPlaceChanged);
    endAutocomplete.addListener("place_changed", onPlaceChanged);
  
    // Attach the event listeners for the buttons
    let startButton = document.getElementById("start");
    let endButton = document.getElementById("end");
    startButton.addEventListener("click", onPlaceChanged);
    endButton.addEventListener("click", onPlaceChanged);
  }
  
  function onPlaceChanged() {
    // Get the selected place from the relevant input field
    let place;
    if (this.id === "start" || this.id === "start-button") {
      place = startAutocomplete.getPlace();
    } else if (this.id === "end" || this.id === "end-button") {
      place = endAutocomplete.getPlace();
    }
  
    // Update the UI with the selected place's name
    let details = document.getElementById("details");
    if (!place.geometry) {
      details.innerHTML = "Enter a place";
    } else {
      details.innerHTML = place.name;
    }
  }
  

