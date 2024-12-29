const currentWeatherSection = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast-container');
const locationInput = document.getElementById('location-input');
const locationName = document.getElementById('location-name');
const temperatureValue = document.getElementById('temperature-value');
const weatherDescription = document.getElementById('weather-description');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const feelsLike = document.getElementById('feels-like');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const sunriseSunset = document.getElementById('sunrise-sunset');
const airQualityIndex = document.getElementById('air-quality-index'); // New: Add element for AQI

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}

function searchLocation() {
  const location = locationInput.value;
  if (location) {
    getWeatherDataByLocation(location);
  }
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherDataByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        currentWeatherSection.innerHTML = 'Unable to get location.';
      }
    );
  } else {
    currentWeatherSection.innerHTML = 'Geolocation is not supported by this browser.';
  }
}

function getWeatherDataByCoordinates(lat, lon) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,apparent_temperature,surface_pressure,visibility,is_day&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m,sunrise,sunset&timezone=auto`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data.current); 
      displayForecast(data.daily); 
      displaySunriseSunset(data.daily); 
      // Add air quality data (if available)
      if (data.current.is_day === 1) { 
        // Example: Fetch AQI data from another API (e.g., AirNow) 
        // This is a simplified example and requires an actual AQI API integration
        airQualityIndex.textContent = 'Good'; 
      } else {
        airQualityIndex.textContent = 'N/A'; 
      }
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      currentWeatherSection.innerHTML = 'Unable to fetch weather data.';
    });
}

function getWeatherDataByLocation(location) {
  const apiUrl = `https://api.open-meteo.com/v1/search?name=${location}`; 

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const { latitude, longitude } = data.results[0]; 
      getWeatherDataByCoordinates(latitude, longitude);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      currentWeatherSection.innerHTML = 'Invalid location.';
    });
}

function displayWeather(currentData) {
  const { temperature_2m: temperature, weathercode, windspeed_10m: windSpeed, relativehumidity_2m: humidity, apparent_temperature, surface_pressure, visibility, is_day } = currentData;

  locationName.textContent = 'Your Location'; // Replace with actual location logic 
  temperatureValue.textContent = `${temperature.toFixed(1)}`;
  weatherDescription.textContent = getWeatherDescription(weathercode); 
  windSpeed.textContent = `Wind Speed: ${windSpeed} m/s`;
  humidity.textContent = `Humidity: ${humidity}%`;
  feelsLike.textContent = `Feels Like: ${apparent_temperature.toFixed(1)}°C`; 
  pressure.textContent = `Pressure: ${surface_pressure} hPa`; 
  visibility.textContent = `Visibility: ${(visibility / 1000).toFixed(1)} km`; 

  // Dynamically update weather icon (replace with your preferred icon library)
  weatherIcon.innerHTML = `<img src="https://www.openweathermap.org/img/wn/${getWeatherIconCode(weathercode)}@2x.png" alt="${getWeatherDescription(weathercode)}">`; 

  // Add a visual cue for day/night
  if (is_day === 1) {
    document.body.classList.add('day'); 
  } else {
    document.body.classList.remove('day'); 
  }
}

function displayForecast(forecastData) {
  const { time: forecastTimes, temperature_2m: forecastTemps, weathercode: forecastWeatherCodes } = forecastData;
  forecastContainer.innerHTML = ''; 

  forecastTimes.slice(0, 7).forEach((time, index) => { 
    const forecastDate = new Date(time).toLocaleDateString();
    const forecastTemp = forecastTemps[index];
    const forecastIconCode = forecastWeatherCodes[index];

    const forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast-item'); 
    forecastElement.innerHTML = `
      <h3>${forecastDate}</h3>
      <img src="https://www.openweathermap.org/img/wn/${forecastIconCode}@2x.png" alt="Forecast Icon">
      <p>${forecastTemp.toFixed(1)}°C</p>
    `;

    forecastContainer.appendChild(forecastElement);
  });
}

function displaySunriseSunset(dailyData) {
  const sunriseTime = new Date(dailyData.sunrise[0]).toLocaleTimeString(); 
  const sunsetTime = new Date(dailyData.sunset[0]).toLocaleTimeString(); 

  // Add sunrise and sunset information to the UI 
  sunriseSunset.textContent = `Sunrise: ${sunriseTime} | Sunset: ${sunsetTime}`; 
}

// Helper functions 
function getWeatherDescription(weathercode) {
  // This is a simplified example. You can find more detailed descriptions
  // and icon mapping on the Open-Meteo documentation.
  switch (weathercode) {
    case 0: 
      return 'Clear sky';
    case 1: 
      return 'Mainly clear, partly cloudy, and overcast';
    case 2: 
      return 'Mainly clear, partly cloudy, and overcast'; 
    case 3: 
      return 'Mainly clear, partly cloudy, and overcast';
    case 45: 
      return 'Fog and depositing rime fog';
    case 48: 
      return 'Fog and depositing rime fog';
    case 51: 
      return 'Light drizzle: Drizzle, fine, light';
    case 53: 
      return 'Moderate drizzle: Drizzle, moderate';
    case 55: 
      return 'Dense drizzle: Drizzle, dense intensity'; 
    case 56: 
      return 'Light freezing drizzle: Freezing Drizzle, Light'; 
    case 57: 
      return 'Dense freezing drizzle: Freezing Drizzle, Dense Intensity'; 
    case 61: 
      return 'Slight rain: Slight Rain';
    case 63: 
      return 'Moderate rain: Moderate Rain';
    case 65: 
      return 'Heavy rain: Heavy Rain'; 
    case 66: 
      return 'Light freezing rain: Freezing Rain, Light'; 
    case 67: 
      return 'Heavy freezing rain: Freezing Rain, Heavy'; 
    case 71: 
      return 'Slight snow fall: Snow fall slight'; 
    case 73: 
      return 'Moderate snow fall: Snow fall moderate'; 
    case 75: 
      return 'Heavy snow fall: Snow fall heavy'; 
    case 77: 
      return 'Snow grains: Snow grains'; 
    case 80: 
      return 'Rain showers: Rain showers slight'; 
    case 81: 
      return 'Rain showers: Rain showers moderate'; 
    case 82: 
      return 'Rain showers: Rain showers violent'; 
    case 83: 
      return 'Snow showers: Snow showers slight'; 
    case 84: 
      return 'Snow showers: Snow showers moderate'; 
    case 85: 
      return 'Snow showers: Snow showers violent'; 
    default:
      return 'Unknown'; 
    }
  }

  function getWeatherIconCode(weathercode) {
    // This is a
