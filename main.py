# from flask import Flask, request, jsonify
# import requests
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# # Tomorrow.io API key
# TOMORROW_API_KEY = 'l6Z393yxHW9VHoqcsbQwEbUtt2rcRQKb'

# @app.route('/')
# @app.route('/weather', methods=['GET'])
# def get_weather():
#     lat = request.args.get('lat')
#     lon = request.args.get('lon')

#     if not lat or not lon:
#         return jsonify({"error": "Missing latitude or longitude"}), 400

#     # Fetch weather data from Tomorrow.io API using lat/lon
#     weather_url = f"https://api.tomorrow.io/v4/timelines?location={lat},{lon}&fields=temperature,windSpeed,humidity,pressureSeaLevel&timesteps=1d&units=imperial&apikey={TOMORROW_API_KEY}"
#     weather_response = requests.get(weather_url)
#     weather_data = weather_response.json()

#     if 'data' not in weather_data:
#         return jsonify({"error": "Unable to fetch weather data."}), 500

#     # Extract current weather data
#     current_weather = weather_data['data']['timelines'][0]['intervals'][0]['values']

#     # Return the weather data
#     result = {
#         "location": f"Lat: {lat}, Lon: {lon}",
#         "temperature": current_weather['temperature'],
#         "humidity": current_weather['humidity'],
#         "pressure": current_weather['pressureSeaLevel'],
#         "windSpeed": current_weather['windSpeed'],
#     }
#     return jsonify(result)

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# Replace these with your own API keys
GOOGLE_API_KEY = "AIzaSyB32ZyEKGCtbQ3ljMmb_ieZdMZhBXHZ8IA"
TOMORROW_API_KEY = "l6Z393yxHW9VHoqcsbQwEbUtt2rcRQKb"
IPINFO_TOKEN = "8e9152548058e9"

# @app.route('/')
# def home():
#     return "Weather Search App"

@app.route('/weather', methods=['GET'])
def get_weather():
    use_location = request.args.get('useLocation', 'false').lower() == 'true'

    if use_location:
        # If the location checkbox is checked, fetch the user's location using ipinfo.io
        ipinfo_url = f"https://ipinfo.io/?token={IPINFO_TOKEN}"
        ipinfo_response = requests.get(ipinfo_url)
        ipinfo_data = ipinfo_response.json()

        if 'loc' in ipinfo_data:
            lat, lon = ipinfo_data['loc'].split(',')
        else:
            return jsonify({"error": "Unable to fetch location."}), 500

    else:
        # Get address details from the request
        street = request.args.get('street', '')
        city = request.args.get('city', '')
        state = request.args.get('state', '')

        if not street or not city or not state:
            return jsonify({"error": "Please provide a valid street, city, and state."}), 400

        # Convert address to latitude and longitude using Google Geocoding API
        address = f"{street}, {city}, {state}"
        geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={GOOGLE_API_KEY}"
        geocode_response = requests.get(geocode_url)
        geocode_data = geocode_response.json()

        if geocode_data['status'] != 'OK':
            return jsonify({"error": "Geocoding failed. Check your address."}), 400

        lat = geocode_data['results'][0]['geometry']['location']['lat']
        lon = geocode_data['results'][0]['geometry']['location']['lng']

    # Fetch weather data from Tomorrow.io API using lat/lon
    weather_url = f"https://api.tomorrow.io/v4/timelines?location={lat},{lon}&fields=temperature,windSpeed,humidity,pressureSeaLevel&timesteps=1d,1h&units=imperial&timezone=America/Los_Angeles&apikey={TOMORROW_API_KEY}"
    weather_response = requests.get(weather_url)
    weather_data = weather_response.json()

    if 'data' not in weather_data:
        return jsonify({"error": "Unable to fetch weather data."}), 500

    # Extract current weather and forecast data
    current_weather = weather_data['data']['timelines'][0]['intervals'][0]['values']
    forecast = weather_data['data']['timelines'][1]['intervals']

    # Prepare the response
    result = {
        "location": f"{street}, {city}, {state}" if not use_location else f"{ipinfo_data['city']}, {ipinfo_data['region']}, {ipinfo_data['country']}",
        "temperature": current_weather['temperature'],
        "humidity": current_weather['humidity'],
        "pressure": current_weather['pressureSeaLevel'],
        "windSpeed": current_weather['windSpeed'],
        "forecast": [
            {
                "date": interval['startTime'],
                "tempHigh": interval['values']['temperatureMax'],
                "tempLow": interval['values']['temperatureMin'],
                "windSpeed": interval['values']['windSpeed'],
                "status": interval['values']['weatherCode']  # You can map this code to a textual description or icon in the frontend
            }
            for interval in forecast
        ]
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
