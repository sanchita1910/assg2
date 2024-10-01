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
    fetchWeather(useLocation, streetFieldInput.value, cityFieldInput.value, stateFieldSelect.value);

    // Prepare query parameters
    const params = new URLSearchParams({
        useLocation: useLocation.toString(),
        street: streetFieldInput.value,
        city: cityFieldInput.value,
        state: stateFieldSelect.value
    });
   

  // Function to send data to Flask backend
    async function fetchWeatherData(lat, lon, street, city, state) {
    const params = new URLSearchParams({ lat, lon, street, city, state });

    const response =  await fetch(`http://127.0.0.1:5000/weather?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
        // Clear previous results
        resultDiv.innerHTML = '';

        if (data.error) {
            resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;

            //remove this later 
            console.log(params);
        } else {

            resultDiv.innerHTML = `
               <div id="first-card">
                <div class="weather-card">
                    <div class="place" id="first-card-loc"></div>
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
                </div>
            `;

            let dailyForecastTable = `
            <div id="daily-forecast-table-container">
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
                    <tr class="weather-data-row" onClick="displayWeatherCard('${formattedDate}', '${day.weatherDescription}', ${day.temperature_high}, ${day.temperature_low}, ${day.windSpeed}, ${day.precipitationProbability}, ${day.precipitationType}, ${day.visibility}, ${day.humidity}, '${day.sunriseTime}',' ${day.sunsetTime}', '${day.weathericonlocation}', '${date.toISOString()}')">
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
            </div>
            `;

            resultDiv.innerHTML += dailyForecastTable;
        }
}

// Function to get location using IPInfo API
function getLocationByIPInfo() {
    const ipinfoToken = "8e9152548058e9";
    return fetch(`https://ipinfo.io/?token=${ipinfoToken}`)
        .then(response => response.json())
        .then(data => {
            const [lat, lon] = data.loc.split(',');
            const weather_loc = data.city +"," + data.region;
            return { lat, lon, weather_loc };
        })
        .catch(error => {
            console.error('Error fetching location from IPInfo:', error);
            throw new Error('Unable to fetch location.');
        });
}

// Function to get coordinates using Google Geocoding API
function getLocationByAddress(street, city, state) {
    const googleApiKey = "AIzaSyB32ZyEKGCtbQ3ljMmb_ieZdMZhBXHZ8IA";
    const address = `${street}, ${city}, ${state}`;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`;
    
    return fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'OK') {
                throw new Error('Geocoding failed. Check your address.');
            }
            const { lat, lng } = data.results[0].geometry.location;
            const weather_loc = data.results[0].formatted_address;
            return { lat, lon: lng, weather_loc };
        })
        .catch(error => {
            console.error('Error fetching location from Google Geocoding:', error);
            throw new Error('Unable to fetch location from address.');
        });
}



// Function to handle location-based weather fetching
 async function fetchWeather(useLocation, street, city, state) {
let weather_location;
    if (useLocation) {
       const  { lat, lon, weather_loc } = await getLocationByIPInfo()
             await fetchWeatherData(lat, lon)
             weather_location = weather_loc;
            
    } else {
        if (!street || !city || !state) {
            alert('Please provide a valid street, city, and state.');
            return;
        }
        const { lat, lon, weather_loc } = await getLocationByAddress(street, city, state)
            await fetchWeatherData(lat, lon)
            weather_location = weather_loc;     
    }
    const first_card_loc = document.getElementById("first-card-loc")
    first_card_loc.innerHTML = weather_location;
}


});

 // Function to display the weather card
 function displayWeatherCard(formattedDate, weatherDescription, temperature_high, temperature_low, windSpeed, precipitationProbability, precipitationType, visibility, humidity, sunriseTime, sunsetTime, weathericonlocation, date) {
    const selectedDay = {
        formattedDate,
        weatherDescription,
        temperature_high,
        temperature_low,
        windSpeed,
        precipitationProbability,
        precipitationType,
        visibility,
        humidity,
        sunriseTime,
        sunsetTime,
        weathericonlocation,
        date
    }; // Retrieve the corresponding day using the index

      //Hide the daily first weather card and  forecast table
      const dailyForecastTableContainer = document.getElementById('daily-forecast-table-container');
      dailyForecastTableContainer.style.display = 'none';
      const firstCard = document.getElementById('first-card');
      firstCard.style.display = 'none';

    // Create the card for the selected day's weather
    // need location from above function

    const forecastCard =`
        <div class="weather-card-2">
    <div class="wc-date">
        <span class="wc-day">  ${formattedDate}</span>
    </div>
    <div class="wc-main-info">
        <div class="wc-icon-desc">
            <div class="wc-weather-icon">
               <img src="${weathericonlocation}"
            </div>
            <div class="wc-condition">${selectedDay.weatherDescription}</div>
        </div>
        <div class="wc-temperature">
            <span class="wc-temp-value">${selectedDay.temperature_high.toFixed(1)}</span> °F/ 
            <span class="wc-temp-value">${selectedDay.temperature_low.toFixed(1)}</span>°F
        </div>
    </div>
    <div class="wc-details">
        <div class="wc-detail-item">
            <span class="wc-detail-label">Precipitation: </span>
            <span class="wc-detail-value">${precipitationProbability}% </span>
        </div>
        <div class="wc-detail-item">
            <span class="wc-detail-label">Chance of Rain: </span>
            <span class="wc-detail-value"> ${precipitationType}</span>
        </div>
        <div class="wc-detail-item">
            <span class="wc-detail-label">Wind Speed: </span>
            <span class="wc-detail-value">${selectedDay.windSpeed.toFixed(2)} mph</span>
        </div>
        <div class="wc-detail-item">
            <span class="wc-detail-label">Humidity: </span>
            <span class="wc-detail-value">${humidity}% </span>
        </div>
        <div class="wc-detail-item">
            <span class="wc-detail-label">Visibility: </span>
            <span class="wc-detail-value">${visibility}% </span>
        </div>
        <div class="wc-detail-item">
            <span class="wc-detail-label">Sunrise/Sunset: </span>
            <span class="wc-detail-value">${sunriseTime}/${sunsetTime}</span>
        </div>
    </div>
</div>

    `;

    // Add the forecast card to the forecastCardsContainer
    resultDiv.innerHTML += forecastCard;

    // chart 1 
    ;(async () => {
        const data = await fetch(
          "https://www.highcharts.com/samples/data/range.json",
        ).then((response) => response.json())
      
        Highcharts.chart("chart1", {
          chart: {
            type: "arearange",
            zooming: {
              type: "x",
            },
            scrollablePlotArea: {
              minWidth: 600,
              scrollPositionX: 1,
            },
          },
          title: {
            text: "Temperature variation by day",
          },
          xAxis: {
            type: "datetime",
            tickInterval: 24 * 3600 * 1000, // one day
          },
          yAxis: {
            title: {
              text: null,
            },
          },
          tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: "°C",
            xDateFormat: "%A, %b %e",
          },
          legend: {
            enabled: false,
          },
          series: [
            {
              name: "Temperatures",
              data: data.slice(0,7),
              pointStart: Date.UTC(
                new Date().getUTCFullYear(),
                new Date().getUTCMonth(),
                new Date().getUTCDate() - 6,
              ),
            },
          ],
        })
      })() 
}

