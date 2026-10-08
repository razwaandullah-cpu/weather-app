const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityElement = document.getElementById("city");
const temperatureElement = document.getElementById("temperature");
const conditionElement = document.getElementById("condition");
const windElement = document.getElementById("wind");
const errorElement = document.getElementById("error");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        errorElement.textContent = "Please enter a city.";
        return;
    }

    errorElement.textContent = "";

    try {
        // Find the city's coordinates
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            errorElement.textContent = "City not found.";
            return;
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get the weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`
        );

        const weatherData = await weatherResponse.json();

        const temperature = weatherData.current.temperature_2m;
        const windSpeed = weatherData.current.wind_speed_10m;
        const weatherCode = weatherData.current.weather_code;

        cityElement.textContent = location.name;
        temperatureElement.textContent = `${temperature}°C`;
        windElement.textContent = `Wind: ${windSpeed} km/h`;
        conditionElement.textContent = getWeatherCondition(weatherCode);

    } catch (error) {
        errorElement.textContent = "Something went wrong. Try again.";
        console.error(error);
    }
}

function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear sky ☀️";
    } 
    
    if (code >= 1 && code <= 3) {
        return "Partly cloudy ⛅";
    } 
    
    if (code >= 45 && code <= 48) {
        return "Foggy 🌫️";
    } 
    
    if (code >= 51 && code <= 67) {
        return "Rainy 🌧️";
    } 
    
    if (code >= 71 && code <= 77) {
        return "Snowy ❄️";
    } 
    
    if (code >= 80 && code <= 82) {
        return "Rain showers 🌦️";
    } 
    
    if (code >= 95) {
        return "Thunderstorm ⛈️";
    }

    return "Unknown weather";
}