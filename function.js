// Get the form's input data
  const useLocationCheckbox = document.getElementById('use-location');
  const streetFieldInput = document.getElementById('street-field');
  const cityFieldInput = document.getElementById('city');
  const stateFieldSelect = document.getElementById('state');
  const resultDiv = document.getElementById('result');
  const submitButton = document.getElementById('submit-btn');



// API keys initialization
  const ipinfoApiToken = '8e9152548058e9';
  const googleApiKey = 'AIzaSyB32ZyEKGCtbQ3ljMmb_ieZdMZhBXHZ8IA';

// Function to toggle disable/enable the input fields based on checkbox
  useLocationCheckbox.addEventListener('change', function() {
      if (this.checked) {
          // Checkbox is checked, disable inputs and clear values
          streetFieldInput.value = '';
          cityFieldInput.value = '';
          stateFieldSelect.value = '';

          streetFieldInput.disabled = true;
          cityFieldInput.disabled = true;
          stateFieldSelect.disabled = true;

          streetFieldInput.removeAttribute('required');
          cityFieldInput.removeAttribute('required');
          stateFieldSelect.removeAttribute('required');
      } else {
          // Checkbox is unchecked, enable inputs and make them required again
          streetFieldInput.disabled = false;
          cityFieldInput.disabled = false;
          stateFieldSelect.disabled = false;

          streetFieldInput.setAttribute('required', 'required');
          cityFieldInput.setAttribute('required', 'required');
          stateFieldSelect.setAttribute('required', 'required');
      }
  });

// Optional: Add functionality for the Clear button if needed
  const clearButton = document.getElementById('clear-btn');
  clearButton.addEventListener('click', function() {
      streetFieldInput.value = '';
      cityFieldInput.value = '';
      stateFieldSelect.value = '';
      useLocationCheckbox.checked = false;

      streetFieldInput.disabled = false;
      cityFieldInput.disabled = false;
      stateFieldSelect.disabled = false;

      streetFieldInput.setAttribute('required', 'required');
      cityFieldInput.setAttribute('required', 'required');
      stateFieldSelect.setAttribute('required', 'required');
  });

 // Function to toggle disable/enable the input fields based on checkbox
    useLocationCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Checkbox is checked, disable inputs and clear values
            streetFieldInput.value = '';
            cityFieldInput.value = '';
            stateFieldSelect.value = '';
  
            streetFieldInput.disabled = true;
            cityFieldInput.disabled = true;
            stateFieldSelect.disabled = true;
  
            streetFieldInput.removeAttribute('required');
            cityFieldInput.removeAttribute('required');
            stateFieldSelect.removeAttribute('required');
        } else {
            // Checkbox is unchecked, enable inputs and make them required again
            streetFieldInput.disabled = false;
            cityFieldInput.disabled = false;
            stateFieldSelect.disabled = false;
  
            streetFieldInput.setAttribute('required', 'required');
            cityFieldInput.setAttribute('required', 'required');
            stateFieldSelect.setAttribute('required', 'required');
        }
    });
  
// Function to handle the Submit button click
    submitButton.addEventListener('click', function() {

        // Clear any previous custom validation
        streetFieldInput.setCustomValidity("");
        cityFieldInput.setCustomValidity("");
        stateFieldSelect.setCustomValidity("");

        // If the location checkbox is checked, use the user's location
        if (useLocationCheckbox.checked) {
            debugger
            fetch(`https://ipinfo.io/json?token=${ipinfoApiToken}`)
                .then(response => response.json())
                .then(data => {
                    const loc = data.loc.split(',');
                    const lat = loc[0];
                    const lon = loc[1];
                    // Send lat/lon to the backend
                    fetchWeatherFromBackend(lat, lon);
                })
                .catch(error => {
                    alert("Error fetching geolocation. Please try again.");
                    console.error('Error:', error);
                    console.log(lat,lon,loc);
                });
        } else {
            // Validate the form fields
            // if (!streetFieldInput.value || !cityFieldInput.value || !stateFieldSelect.value) {
            //     // Show error tooltips
            //     if (!streetFieldInput.value) streetFieldInput.setCustomValidity("Please fill out this field.");
            //     if (!cityFieldInput.value) cityFieldInput.setCustomValidity("Please fill out this field.");
            //     if (!stateFieldSelect.value) stateFieldSelect.setCustomValidity("Please select a state.");
            //     return;
            // } 
        //     
        
        // Validate the form fields
        let valid = true;
        if (!streetFieldInput.value) {
            streetFieldInput.setCustomValidity("Please fill out this field.");
            valid = false;
        }
        if (!cityFieldInput.value) {
            cityFieldInput.setCustomValidity("Please fill out this field.");
            valid = false;
        }
        if (!stateFieldSelect.value) {
            stateFieldSelect.setCustomValidity("Please select a state.");
            valid = false;
        }

        // Show tooltips if validation fails
        if (!valid) {
            streetFieldInput.reportValidity();
            cityFieldInput.reportValidity();
            stateFieldSelect.reportValidity();
            return;
        }

        // If valid, use Google Geocoding API to get lat/lon
        const address = `${streetFieldInput.value}, ${cityFieldInput.value}, ${stateFieldSelect.value}`;
        const googleGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`;
        
        fetch(googleGeocodeUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    const lat = data.results[0].geometry.location.lat;
                    const lon = data.results[0].geometry.location.lng;
                    // Send lat/lon to the backend
                    fetchWeatherFromBackend(lat, lon);
                } else {
                    alert("Geocoding failed. Please check the address.");
                }
            })
            .catch(error => {
                alert("Error fetching coordinates. Please try again.");
                console.error('Error:', error);
            });
        }
    });
    
// Function to handle the Clear button click
    clearButton.addEventListener('click', function() {
        // Clear the form fields
        streetFieldInput.value = '';
        cityFieldInput.value = '';
        stateFieldSelect.value = '';
        useLocationCheckbox.checked = false;
  
        // Enable the input fields
        streetFieldInput.disabled = false;
        cityFieldInput.disabled = false;
        stateFieldSelect.disabled = false;
  
        streetFieldInput.setAttribute('required', 'required');
        cityFieldInput.setAttribute('required', 'required');
        stateFieldSelect.setAttribute('required', 'required');
  
        // Clear the result area
        resultDiv.innerHTML = '';
    });

 // Function to call the Flask backend and fetch weather data
  function fetchWeatherFromBackend(lat, lon) {
    const apiUrl = `http://localhost:5000/weather?lat=${lat}&lon=${lon}`;
    // Make a GET request to the backend with lat and lon
    fetch(apiUrl, {
        method: 'GET', // Explicitly specifying GET
        headers: {
            'Content-Type': 'application/json'  // Optionally specify content type
        }
        })
        .then(response => response.json())
        .then(data => {
            // Clear the previous results
            resultDiv.innerHTML = '';
            
            // Display the weather information
            if (data.error) {
                resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                resultDiv.innerHTML = `
                    <div class="card">
                        <h2>Weather Information for ${data.location}</h2>
                        <p>Temperature: ${data.temperature} °F</p>
                        <p>Humidity: ${data.humidity}%</p>
                        <p>Pressure: ${data.pressure} hPa</p>
                        <p>Wind Speed: ${data.windSpeed} mph</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            alert("Error fetching weather data. Please try again.");
            console.error('Error:', error);
        });
}