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

// Your provided OpenWeather API Key
const apiKey = 'b2f5a31713cd9cf1d6d79e14439fc163'; // Replace with your actual OpenWeather API key

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
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data); 
      getForecast(lat, lon); // Get forecast data
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      currentWeatherSection.innerHTML = 'Unable to fetch weather data.';
    });
}

function getWeatherDataByLocation(location) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
      getForecast(data.coord.lat, data.coord.lon); // Get forecast data using coordinates
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      currentWeatherSection.innerHTML = 'Invalid location.';
    });
}

function getForecast(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayForecast(data); 
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
    });
}

function displayWeather(data) {
  const { name, main, weather, wind, sys } = data;

  locationName.textContent = name; 
  temperatureValue.textContent = `${main.temp.toFixed(1)}°C`;
  weatherDescription.textContent = weather[0].description; 
  windSpeed.textContent = `Wind Speed: ${wind.speed} m/s`;
  humidity.textContent = `Humidity: ${main.humidity}%`;
  feelsLike.textContent = `Feels Like: ${main.feels_like.toFixed(1)}°C`; 
  pressure.textContent = `Pressure: ${main.pressure} hPa`; 
  visibility.textContent = `Visibility: ${(data.visibility / 1000).toFixed(1)} km`;

  // Displaying sunrise and sunset times
  const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString();
  const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString();
  sunriseSunset.textContent = `Sunrise: ${sunriseTime} | Sunset: ${sunsetTime}`; 

  // Update weather icon dynamically
  const iconCode = weather[0].icon;
  weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}">`;
}

function displayForecast(data) {
  const forecastData = data.list.slice(0, 7); // Get first 7 forecast entries (next 24 hours)
  forecastContainer.innerHTML = ''; 

  forecastData.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleString();
    const temp = forecast.main.temp;
    const iconCode = forecast.weather[0].icon;

    const forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast-item');
    forecastElement.innerHTML = `
      <h3>${date}</h3>
      <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${forecast.weather[0].description}">
      <p>${temp.toFixed(1)}°C</p>
    `;

    forecastContainer.appendChild(forecastElement);
  });
}

// Helper functions 
function getWeatherDescription(weatherCode) {
  switch (weatherCode) {
    case '01d': return 'Clear sky';
    case '02d': return 'Few clouds';
    case '03d': return 'Scattered clouds';
    case '04d': return 'Broken clouds';
    case '09d': return 'Shower rain';
    case '10d': return 'Rain';
    case '11d': return 'Thunderstorm';
    case '13d': return 'Snow';
    case '50d': return 'Mist';
    default: return 'Unknown weather'; 
  }
}
