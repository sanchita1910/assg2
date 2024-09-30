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

// Function to handle the Submit button click
submitButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form from submitting traditionally

    // Clear previous validation errors
    streetFieldInput.setCustomValidity("");
    cityFieldInput.setCustomValidity("");
    stateFieldSelect.setCustomValidity("");

    // Prepare data to send to the Flask backend
    let useLocation = useLocationCheckbox.checked;
    let valid = true;

    // If the location checkbox is unchecked, validate the input fields
    if (!useLocation) {
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

        // Show validation errors if the form is invalid
        if (!valid) {
            streetFieldInput.reportValidity();
            cityFieldInput.reportValidity();
            stateFieldSelect.reportValidity();
            return;
        }
    }

    // Prepare query parameters
    const params = new URLSearchParams({
        useLocation: useLocation.toString(),
        street: streetFieldInput.value,
        city: cityFieldInput.value,
        state: stateFieldSelect.value
    });
   

    // Function to Send the data to the Flask backend
    fetch(`http://127.0.0.1:5000/weather?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Clear previous results
        resultDiv.innerHTML = '';

        if (data.error) {
            resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;

            //remove this later 
            console.log(params);
        } else {

            resultDiv.innerHTML = `
    
                <div class="weather-card">
                    <div class="place">${data.location}</div>
                    <div class="main-info">
                    <div class="icon-desc">
                    <div>
                    <image class="icon-img" src="${data.current.weathericonlocation}"> </image>
                    </div>
                    <div class="condition">${data.current.weatherDescription}</div>
                    </div>
                    <div class="temperature">
                            <span class="temp-value">${data.current.temperature.toFixed(1)}</span>°
                        </div>
                    </div>
                    <div class="details">
                        <div class="detail-item">
                            <span class="detail-label">Humidity</span>
                            <image class="detail-img" src="Images/humidity.png"> </image>
                            <span class="detail-value">${data.current.humidity}%</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Pressure</span>
                            <image class="detail-img" src="Images/Pressure.png"> </image>
                            <span class="detail-value">${data.current.pressure.toFixed(2)}inHg</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Wind Speed</span>
                            <image class="detail-img" src="Images/Wind_Speed.png"> </image>
                            <span class="detail-value">${data.current.windSpeed.toFixed(2)}mph</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Visibility</span>
                            <image class="detail-img" src="Images/Visibility.png"> </image>
                            <span class="detail-value">${data.current.visibility}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Cloud Cover</span>
                            <image class="detail-img" src="Images/Cloud_Cover.png"> </image>
                            <span class="detail-value">${data.current.cloudCover}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">UV Level</span>
                            <image class="detail-img" src="Images/UV_Level.png"> </image>
                            <span class="detail-value">${data.current.uvIndex}</span>
                        </div>
                    </div>
                </div>
            `;

            let dailyForecastTable = `
            <div class="weather-table">
                <table class="forecast-table">
                    <thead>
                        <tr class="weather-table-row">
                            <th>Date</th>
                            <th> Status</th>
                            <th> Temp High</th>
                            <th> Temp Low</th>
                            <th>Wind Speed</th>
                        </tr>
                    </thead>
                    <tbody>
                </div>
            `;

            data.daily_forecast.forEach((day, index) => {
                const date = new Date(day.date);
                
                // Format the date to "Monday, 09 September 2024"
                const formattedDate = date.toLocaleDateString('en-US', {
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long',  
                    day: '2-digit'   
                });
                dailyForecastTable += `
                    <tr class="weather-data-row" onClick="displayWeatherCard(${index}, JSON.stringify(day))">
                        <td>${formattedDate}</td>
                        <td> 
                        <div class="status-container">
                            <image class="status-img" src="${data.current.weathericonlocation}"> </image>
                                <div class="status-desc">
                                ${day.weatherDescription}
                                </div>
                        </div>
                        </td>   
                        <td>${day.temperature_high.toFixed(1)}</td>
                        <td>${day.temperature_low.toFixed(1)}</td>
                        <td>${day.windSpeed.toFixed(1)}</td>                     
                    </tr>
                `;
            });

            dailyForecastTable += `
                    </tbody>
                </table>
            `;

            resultDiv.innerHTML += dailyForecastTable;
        }
    })
    .catch(error => {
        alert("Error fetching weather data. Please try again.");
        console.error('Error:', error);
    });
});

 // Function to display the weather card
 function displayWeatherCard(index, data) {
    const selectedDay = data.daily_forecast[index];  // Retrieve the corresponding day using the index

    // Create the card for the selected day's weather
    const forecastCard = `
        <div class="weather-card">
            <div class="place">${data.location} - Forecast for ${new Date(selectedDay.date).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: '2-digit'})}</div>
            <div class="main-info">
                <div class="icon-desc">
                    <div>
                        <img class="icon-img" src="${selectedDay.weathericonlocation}"> <!-- Use the correct daily forecast icon -->
                    </div>
                    <div class="condition">${selectedDay.weatherDescription}</div>
                </div>
                <div class="temperature">
                    <span class="temp-value">${selectedDay.temperature_high.toFixed(1)}</span>° / 
                    <span class="temp-value">${selectedDay.temperature_low.toFixed(1)}</span>°
                </div>
            </div>
            <div class="details">
                <div class="detail-item">
                    <span class="detail-label">Wind Speed</span>
                    <img class="detail-img" src="Images/Wind_Speed.png"> 
                    <span class="detail-value">${selectedDay.windSpeed.toFixed(2)} mph</span>
                </div>
            </div>
        </div>
    `;

    // Add the forecast card to the forecastCardsContainer
    document.getElementById('forecastCardsContainer').innerHTML += forecastCard;
}