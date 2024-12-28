
document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "your_api_key_here";
    const weatherDataDiv = document.getElementById("weather-data");
    const gifContainer = document.getElementById("gif-container");
    const weatherSound = document.getElementById("weather-sound");
    const themeToggle = document.getElementById("theme-toggle");

    // Fetch Weather Data
    async function fetchWeather() {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${apiKey}`
            );
            const data = await response.json();
            displayWeather(data);
            fetchGif(data.weather[0].description);
            playSound(data.weather[0].main);
        } catch (error) {
            weatherDataDiv.innerHTML = "Error loading weather data.";
        }
    }

    // Display Weather Data
    function displayWeather(data) {
        const { name, main, weather } = data;
        weatherDataDiv.innerHTML = `
            <h3>${name}</h3>
            <p>Temperature: ${main.temp}°C</p>
            <p>Condition: ${weather[0].description}</p>
        `;
    }

    // Fetch GIF based on weather description
    async function fetchGif(description) {
        const apiKey = "your_giphy_api_key_here";
        const response = await fetch(
            `https://api.giphy.com/v1/gifs/translate?api_key=${apiKey}&s=${description}`
        );
        const { data } = await response.json();
        gifContainer.innerHTML = `<img src="${data.images.fixed_height.url}" alt="${description}">`;
    }

    // Play sound based on weather condition
    function playSound(condition) {
        const sounds = {
            Clear: "https://example.com/sounds/sunny.mp3",
            Rain: "https://example.com/sounds/rain.mp3",
            Clouds: "https://example.com/sounds/cloudy.mp3",
        };
        weatherSound.src = sounds[condition] || "";
    }

    // Toggle Theme
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // Initialize
    fetchWeather();
});
