const weatherCity = document.getElementById("weather-city");
const weatherBtn = document.getElementById("weather-btn");
const weatherOutput = document.getElementById("weather-output");

// Weather Card

// Loading state
function renderWeatherLoading() {
    weatherOutput.textContent = 'Fetching weather...';
    weatherOutput.setAttribute('aria-busy', 'true');
}

async function handleGetWeather() {
    // check if user inputed something
    const userCity = weatherCity.value.trim();
    if (userCity === "") {
        weatherOutput.textContent = "Please enter a city.";
        return;
    } 

    // get weather data, disable button while waiting
    weatherBtn.disabled = true;
    renderWeatherLoading();

    // geocode the city
    const location = await geocodeCity(userCity);

    if (location === null) {
        weatherOutput.textContent = "City not found.";
        weatherBtn.disabled = false;
        weatherOutput.setAttribute('aria-busy', 'false');
        return;
    } weatherOutput.textContent = `Found: ${location.name}, ${location.country}...`; 

    // get forecast
    const forecast = await fetchForecast(location.latitude, location.longitude);
    if (!forecast) {
        weatherOutput.textContent = "Could not fetch weather data. Try again.";
        weatherBtn.disabled = false;
        weatherOutput.setAttribute('aria-busy', 'false');
        return;
    }
    renderWeatherSuccess(location, forecast);
    weatherBtn.disabled = false;
}

// Gets lat/lon of city inputed
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
        console.log(`Geocode error for ${city}:`, error)
        return null;
    }
}

// Gets weather with lat/lon
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=fahrenheit`)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const cur = data.current?.temperature_2m;
        const feel = data.current?.apparent_temperature;
        const hi = data.daily?.temperature_2m_max[0];
        const lo = data.daily?.temperature_2m_min[0];

        if ([cur, feel, hi, lo].some(v => typeof v !== "number")) {
            return null;
        } else {
            return {current: Math.round(cur), feelsLike: Math.round(feel), high: Math.round(hi), low: Math.round(lo), updatedAtISO: data.current?.time ?? new Date().toISOString()};
        }
    } catch (error) {
        console.error("Forecast fetch failed:", error);
        return null;
    }
}

// Display content fetched
function renderWeatherSuccess(location, forecast) {
    const cityName = location.name;
    const countryName = location.country;
    const current = forecast.current;
    const feels = forecast.feelsLike;
    const high = forecast.high;
    const low = forecast.low;
    const updatedLabel = new Date(forecast.updatedAtISO).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    weatherOutput.textContent = "";

    weatherOutput.innerHTML = `
        <p><strong>Weather - ${cityName}, ${countryName}</strong></p> 
        <p><strong>Current: </strong>${current}°F</p>
        <p><strong>Feels Like: </strong>${feels}°F</p>
        <p><strong>Today: </strong>High: ${high}°F / Low ${low}°F</p>
        <p>Updated at ${updatedLabel}. <span aria-label="Data source">ⓘ Data from Open-Meteo</span></p>
    `;

    weatherOutput.setAttribute('aria-busy', 'false');
}

weatherBtn.addEventListener("click", handleGetWeather)