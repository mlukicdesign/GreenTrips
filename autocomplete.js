function initAutocomplete() {

  
    // Create the Autocomplete objects for start and end inputs
    let startAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById("start"),
      {
        types: ["establishment"],
        componentRestrictions: { country: ["AU"] },
        fields: ["place_id", "geometry", "name"],
      }
    );
    let endAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById("end"),
      {
        types: ["establishment"],
        componentRestrictions: { country: ["AU"] },
        fields: ["place_id", "geometry", "name"],
      }
    );

}
    
  

