const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; 
const currentWeatherSection = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast-container');
const locationInput = document.getElementById('location-input');
const locationName = document.getElementById('location-name');
const temperatureValue = document.getElementById('temperature-value');
const weatherDescription = document.getElementById('weather-description');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const weatherIcon = document.getElementById('weather-icon');

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
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
      getForecastDataByCoordinates(lat, lon); // Fetch forecast data along with current weather
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      currentWeatherSection.innerHTML = 'Unable to fetch weather data.';
    });
}

function getWeatherDataByLocation(location) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
      getForecastDataByLocation(location); // Fetch forecast data along with current weather
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      currentWeatherSection.innerHTML = 'Invalid location.';
    });
}

function getForecastDataByCoordinates(lat, lon) {
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  fetch(forecastApiUrl)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
      forecastContainer.innerHTML = 'Unable to fetch forecast data.';
    });
}

function getForecastDataByLocation(location) {
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

  fetch(forecastApiUrl)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
      forecastContainer.innerHTML = 'Unable to fetch forecast data.';
    });
}

function displayWeather(data) {
  const { name } = data;
  const { temp, description, humidity } = data.main;
  const { speed } = data.wind;
  const iconCode = data.weather[0].icon;

  locationName.textContent = name;
  temperatureValue.textContent = `${temp.toFixed(1)}`;
  weatherDescription.textContent = description;
  windSpeed.textContent = `Wind Speed: ${speed} m/s`;
  humidity.textContent = `Humidity: ${humidity}%`;

  // Dynamically update weather icon
  weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">`; 
}

function displayForecast(data) {
  const forecastList = data.list;
  forecastContainer.innerHTML = ''; 

  forecastList.forEach(forecast => {
    const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString();
    const forecastTemp = forecast.main.temp;
    const forecastIcon = forecast.weather[0].icon;

    const forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast-item'); 
    forecastElement.innerHTML = `
      <h3>${forecastDate}</h3>
      <img src="http://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="Forecast Icon">
      <p>${forecastTemp.toFixed(1)}°C</p>
    `;

    forecastContainer.appendChild(forecastElement);
  });
}

// Get current location weather on page load
getCurrentLocation();

// Add event listener to the search button
const searchButton = document.querySelector('#location-search button');
searchButton.addEventListener('click', searchLocation);
