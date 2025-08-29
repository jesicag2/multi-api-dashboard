const weatherCity = document.getElementById("weather-city");
const weatherBtn = document.getElementById("weather-btn");
const weatherOutput = document.getElementById("weather-output");

const currencyAmount = document.getElementById("currency-amount");
const currencyFrom = document.getElementById("currency-from");
const currencyTo = document.getElementById("currency-to");
const currencyBtn = document.getElementById("currency-btn");
const currencyOutput = document.getElementById("currency-output");

const dogBtn = document.getElementById("dog-btn");
const dogOutput = document.getElementById("dog-output")

// Weather Card

async function handleGetWeather() {
    // check if user inputed something
    const userCity = weatherCity.value.trim();
    if (userCity === "") {
        weatherOutput.textContent = "Please enter a city.";
        return;
    } 

    // loading state: get weather data, disable button while waiting
    weatherBtn.disabled = true;
    weatherOutput.textContent = 'Fetching weather...';

    // geocode the city
    const location = await geocodeCity(userCity);

    if (location === null) {
        weatherOutput.textContent = "City not found.";
        weatherBtn.disabled = false;
        return;
    } weatherOutput.textContent = `Found: ${location.name}, ${location.country}...`; 

    // get forecast
    const forecast = await fetchForecast(location.latitude, location.longitude);
    if (!forecast) {
        weatherOutput.textContent = "Could not fetch weather data. Try again.";
        weatherBtn.disabled = false;
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
        <p><small>Updated at ${updatedLabel}. <span aria-label="Data source">ⓘ Open-Meteo</span></small></p>
    `;
}


// Currency Card

async function handleGetRates() {
    // check user inputs
    const userAmount = parseFloat(currencyAmount.value);
    const userFrom = currencyFrom.value;
    const userTo = currencyTo.value;

    if (!Number.isFinite(userAmount) || userAmount <= 0) {
        currencyOutput.textContent = "Please enter a valid amount, greater than 0.";
        return;
    }
    if (userFrom === userTo) {
        currencyOutput.textContent = "Please choose two different currencies.";
        return;
    } 

    // loading state: get currency data, disable button while waiting
    currencyBtn.disabled = true;
    currencyOutput.textContent = 'Converting currency...';

    // call fetch rates function
    const conversion = await fetchRates(userFrom, userTo);

    if (!conversion) {
        currencyOutput.textContent = "Could not fetch exchange rates. Try again.";
        currencyBtn.disabled = false;
        return
    }

    // compute the exchange rate
    const converted = (userAmount * conversion.rate).toFixed(2);
    const amount = userAmount.toFixed(2);
    const rate = conversion.rate.toFixed(4);

    renderRatesSuccess(amount, userFrom, userTo, rate, converted, conversion.date, conversion.source);
    currencyBtn.disabled = false;
}

// Gets conversion rates
async function fetchRates(from, to) {
    try {
        const response = await fetch(`https://api.vatcomply.com/rates?base=${from}`)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data || !data.rates) {
            return null; 
        } 
        const rate = data.rates[to]
        
        if (typeof rate !== "number"){
            return null
        } else {
            return {rate: rate, date: data.date, source: 'VATComply'}
        }
    } catch (error) {
        console.error("Rates fetch failed:", error);
        return null;
    }
}

// Display content fetched
function renderRatesSuccess(amount, from, to, rate, converted, date, source) {
    currencyOutput.textContent = "";

    currencyOutput.innerHTML = `
        <p><strong>Result: </strong>${amount} ${from} = ${converted} ${to}</p>
        <p><small><strong>Exchange Rate: </strong> 1 ${from} = ${rate} ${to} · As of ${date} · <span aria-label="Data source">ⓘ ${source}</span></small></p>
    `;
}

// GitHub Card


// Dog Card




weatherBtn.addEventListener("click", handleGetWeather);
currencyBtn.addEventListener("click", handleGetRates);