from flask import Flask, request, jsonify
import requests
from datetime import datetime, timedelta
from flask import Flask, render_template
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

@app.route('/')
def weather_page():
    return render_template('weather_page.html')

# Replace these with your own API keys
GOOGLE_API_KEY = "AIzaSyB32ZyEKGCtbQ3ljMmb_ieZdMZhBXHZ8IA"
TOMORROW_API_KEY = "l6Z393yxHW9VHoqcsbQwEbUtt2rcRQKb"
IPINFO_TOKEN = "8e9152548058e9"

WEATHER_CODE_MAPPING = {
    4201: {"description": "Heavy Rain", "iconlocation": "Images/Weather Symbols for Weather Codes/rain_heavy.svg"},
    4001: {"description": "Rain", "iconlocation": "Images/Weather Symbols for Weather Codes/rain.svg"},
    4200: {"description": "Light Rain", "iconlocation": "Images/Weather Symbols for Weather Codes/rain_light.svg"},
    6201: {"description": "Heavy Freezing Rain", "iconlocation": "Images/Weather Symbols for Weather Codes/freezing_rain_heavy.svg"},
    6001: {"description": "Freezing Rain", "iconlocation": "Images/Weather Symbols for Weather Codes/freezing_rain.svg"},
    6200: {"description": "Light Freezing Rain", "iconlocation": "Images/Weather Symbols for Weather Codes/freezing_rain_light.svg"},
    6000: {"description": "Freezing Drizzle", "iconlocation": "Images/Weather Symbols for Weather Codes/freezing_drizzle.svg"},
    4000: {"description": "Drizzle", "iconlocation": "Images/Weather Symbols for Weather Codes/drizzle.svg"},
    7101: {"description": "Heavy Ice Pellets", "iconlocation": "Images/Weather Symbols for Weather Codes/ice_pellets_heavy.svg"},
    7000: {"description": "Ice Pellets", "iconlocation": "Images/Weather Symbols for Weather Codes/ice_pellets.svg"},
    7102: {"description": "Light Ice Pellets", "iconlocation": "Images/Weather Symbols for Weather Codes/ice_pellets_light.svg"},
    5101: {"description": "Heavy Snow", "iconlocation": "Images/Weather Symbols for Weather Codes/snow_heavy.svg"},
    5000: {"description": "Snow", "iconlocation": "Images/Weather Symbols for Weather Codes/snow.svg"},
    5100: {"description": "Light Snow", "iconlocation": "Images/Weather Symbols for Weather Codes/snow_light.svg"},
    5001: {"description": "Flurries", "iconlocation": "Images/Weather Symbols for Weather Codes/flurries.svg"},
    8000: {"description": "Thunderstorm", "iconlocation": "Images/Weather Symbols for Weather Codes/tstorm.svg"},
    2100: {"description": "Light Fog", "iconlocation": "Images/Weather Symbols for Weather Codes/fog_light.svg"},
    2000: {"description": "Fog", "iconlocation": "Images/Weather Symbols for Weather Codes/fog.svg"},
    1001: {"description": "Cloudy", "iconlocation": "Images/Weather Symbols for Weather Codes/cloudy.svg"},
    1102: {"description": "Mostly Cloudy", "iconlocation": "Images/Weather Symbols for Weather Codes/mostly_cloudy.svg"},
    1101: {"description": "Partly Cloudy", "iconlocation": "Images/Weather Symbols for Weather Codes/partly_cloudy_day.svg"},
    1100: {"description": "Mostly Clear", "iconlocation": "Images/Weather Symbols for Weather Codes/mostly_clear_day.svg"},
    1000: {"description": "Clear, Sunny", "iconlocation": "Images/Weather Symbols for Weather Codes/clear_day.svg"}
}

@app.route('/weather', methods=['GET'])
def get_weather():
    # Get lat and lon from the request
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    street = request.args.get('street')
    city = request.args.get('city')
    state = request.args.get('state')
    use_location = request.args.get('loc')

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required."}), 400

    # Fetch weather data from Tomorrow.io API using lat/lon
    weather_url = f"https://api.tomorrow.io/v4/timelines?location={lat},{lon}&fields=temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,uvIndex,weatherCode,precipitationProbability,precipitationType,sunriseTime,sunsetTime,visibility,moonPhase,cloudCover&timesteps=1d,1h&units=imperial&timezone=America/Los_Angeles&apikey={TOMORROW_API_KEY}"
    weather_response = requests.get(weather_url)
    weather_data = weather_response.json()

    if 'data' not in weather_data:
        return jsonify({"error": "Unable to fetch weather data."}), 500

    # Extract current weather and forecast data
    intervals = weather_data['data']['timelines'][0]['intervals']
    current_weather = intervals[0]['values']

     # Map weather code
    weather_code = current_weather['weatherCode']
    weather_condition = WEATHER_CODE_MAPPING.get(weather_code, {"description": "Unknown", "icon": "❓"})

    # Prepare the response
    result = {
        "location": f"{use_location}",
        "current": {
            "temperature": current_weather['temperature'],
            "humidity": current_weather['humidity'],
            "pressure": current_weather['pressureSeaLevel'],
            "windSpeed": current_weather['windSpeed'],
            "cloudCover" : current_weather['cloudCover'],
            "moonPhase" : current_weather['moonPhase'],
            "precipitationProbability" : current_weather['precipitationProbability'],
            "precipitationType" : current_weather['precipitationType'],
            "pressureSeaLevel" : current_weather['pressureSeaLevel'],
            "sunriseTime" : current_weather['sunriseTime'],
            "sunsetTime" : current_weather['sunsetTime'],
            "temperatureApparent" : current_weather['temperatureApparent'],
            "temperatureMax" : current_weather['temperatureMax'],
            "temperatureMin" : current_weather['temperatureMin'],
            "uvIndex" : current_weather['uvIndex'],
            "visibility" : current_weather['visibility'],
            "windDirection" : current_weather['windDirection'],
            "weatherCode" : current_weather['weatherCode'],
            "weatherDescription": weather_condition["description"],
            "weathericonlocation": weather_condition["iconlocation"]
        },
        "hourly_forecast": [
            {
                "time": interval['startTime'],
                "temperature": interval['values']['temperature'],
                "windSpeed": interval['values']['windSpeed']
            }
            for interval in intervals[:24]  # Next 24 hours
        ],
        "daily_forecast": []
    }

    # Calculate daily forecast
    current_date = datetime.fromisoformat(intervals[0]['startTime'][:-6])
    for i in range(7):  # calculating for Next 7 days
        target_date = current_date.date() + timedelta(days=i)
        daily_intervals = [interval for interval in intervals if datetime.fromisoformat(interval['startTime'][:-6]).date() == target_date]
        
        if daily_intervals:
        # Extract sunrise and sunset times
            sunrise_time = None
            sunset_time = None
        
        # Sunrise is the first occurrence in the morning
        for interval in daily_intervals:
            values = interval['values']
            if 'sunriseTime' in values:
                sunrise_time = values['sunriseTime']
                break  
        
        # Sunset is the last occurrence in the evening
        for interval in reversed(daily_intervals):
            values = interval['values']
            if 'sunsetTime' in values:
                sunset_time = values['sunsetTime']
                break  

        if daily_intervals:
            daily_result = {
            #    map weather code with its value  with the table shown in pdf 
                "date": target_date.isoformat(),
                "temperature_high": max(interval['values']['temperature'] for interval in daily_intervals),
                "temperature_low": min(interval['values']['temperature'] for interval in daily_intervals),
                "windSpeed": sum(interval['values']['windSpeed'] for interval in daily_intervals) / len(daily_intervals),
                "humidity": sum(interval['values']['humidity'] for interval in daily_intervals) / len(daily_intervals),
                "precipitationProbability": max(interval['values']['precipitationProbability'] for interval in daily_intervals),
                "cloudCover": max(interval['values']['cloudCover'] for interval in daily_intervals),
                "visibility": min(interval['values']['visibility'] for interval in daily_intervals),
                "sunriseTime": sunrise_time,
                "sunsetTime": sunset_time,
                "precipitationType": max(interval['values']['precipitationType'] for interval in daily_intervals),
                "weathericonlocation": weather_condition["iconlocation"],
                "weatherDescription": weather_condition["description"]

            }
            print(daily_intervals)

            result["daily_forecast"].append(daily_result)

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
