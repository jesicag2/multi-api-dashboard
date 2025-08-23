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

function handleGetWeather() {
    const userCity = weatherCity.value.trim();
    if (userCity === "") {
        weatherOutput.textContent = "Please enter a city.";
        return;
    } 
    if (isWeatherFetching) return;

    isWeatherFetching = true;
    weatherBtn.disabled = true;

    renderWeatherLoading();

    setTimeout(() => {
        isWeatherFetching = false;
        weatherOutput.textContent = 'Waiting for weather...';
        weatherBtn.disabled = false;
        weatherOutput.setAttribute('aria-busy', 'false');
    }, 800);
}

weatherBtn.addEventListener("click", handleGetWeather)