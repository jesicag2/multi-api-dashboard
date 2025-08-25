const weatherCity = document.getElementById("weather-city");
const weatherBtn = document.getElementById("weather-btn");
const weatherOutput = document.getElementById("weather-output");

// Weather Card

// State updates

let isWeatherFetching = false;

// Loading state
function renderWeatherLoading() {
    weatherOutput.textContent = 'Fetching weather...';
    weatherOutput.setAttribute('aria-busy', 'true');
}

async function handleGetWeather() {
    const userCity = weatherCity.value.trim();
    if (userCity === "") {
        weatherOutput.textContent = "Please enter a city.";
        return;
    } 
    if (isWeatherFetching) return;

    isWeatherFetching = true;
    weatherBtn.disabled = true;

    renderWeatherLoading();
    const location = await geocodeCity(userCity);

    if (location === null) {
        weatherOutput.textContent = "City not found.";
        isWeatherFetching = false;
        weatherBtn.disabled = false;
        weatherOutput.setAttribute('aria-busy', 'false');
        return;
    } else {
        weatherOutput.textContent = `Found: ${location.name}, ${location.country}...`;
        isWeatherFetching = false;
        weatherBtn.disabled = false;
        weatherOutput.setAttribute('aria-busy', 'false');
    }   
}

async function geocodeCity(city) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.results?.length) {
            return null;
        } else {
            const hit = data.results[0];
            return {name: hit.name, country: hit.country, latitude: hit.latitude, longitude: hit.longitude};
        }
    } catch (error) {
        return null;
    }
    
}

weatherBtn.addEventListener("click", handleGetWeather)