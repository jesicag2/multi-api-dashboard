const weatherCity = document.getElementById("weather-city");
const weatherBtn = document.getElementById("weather-btn");
const weatherOutput = document.getElementById("weather-output");

const currencyAmount = document.getElementById("currency-amount");
const currencyFrom = document.getElementById("currency-from");
const currencyTo = document.getElementById("currency-to");
const currencyBtn = document.getElementById("currency-btn");
const currencyOutput = document.getElementById("currency-output");

const githubUser = document.getElementById("github-user");
const githubBtn = document.getElementById("github-btn");
const githubOutput = document.getElementById("github-output");

const dogBtn = document.getElementById("dog-btn");
const dogOutput = document.getElementById("dog-output");

const jokeBtn = document.getElementById("joke-btn");
const jokeOutput = document.getElementById("joke-output");

const dictWord = document.getElementById("dictionary-word");
const dictBtn = document.getElementById("dictionary-btn");
const dictOutput = document.getElementById("dictionary-output");

const animeTitle = document.getElementById("anime-title");
const animeBtn = document.getElementById("anime-btn");
const animeOutput = document.getElementById("anime-output");

const numType = document.getElementById("num-type");
const numBtn = document.getElementById("num-btn");
const numOutput = document.getElementById("num-output");

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
            return null;
        } else {
            return {rate: rate, date: data.date, source: 'VATComply'};
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

async function handleGetGitHub() {
    let userProfile = githubUser.value.trim();
    if (userProfile === "") {
        githubOutput.textContent = "Please enter a username.";
        return;
    }
    if (userProfile.startsWith("@")) {
        userProfile = userProfile.slice(1);
    }

    // loading state: 
    githubBtn.disabled = true;
    githubOutput.textContent = 'Fetching user...';

    // fetch user
    const ghProfile = await fetchGitHubUser(userProfile);
    if (ghProfile?.notFound) {
        githubOutput.textContent = "User not found."
        githubBtn.disabled = false;
        return;
    }
    else if (!ghProfile) {
        githubOutput.textContent = "Could not fetch GitHub user data. Try again.";
        githubBtn.disabled = false;
        return;
    }

    renderGitHubSuccess(ghProfile);
    githubBtn.disabled = false;
}

// Gets GitHub user information
async function fetchGitHubUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (response.status === 404) {
            return {notFound: true}; 
        }
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const login = data.login;
        const name = data.name;
        const avatarUrl = data.avatar_url;
        const htmlUrl = data.html_url;
        const bio = data.bio;
        const repos = data.public_repos;

        if (!login) {
            return null;
        }else {
            return {login, name, avatarUrl, htmlUrl, bio, repos};
        }
    } catch (error) {
        console.error("GitHub user fetch failed:", error);
        return null;
    }
}

// Displays content fetched
function renderGitHubSuccess(profile) {
    const { login, name, avatarUrl, htmlUrl, bio, repos } = profile;

    githubOutput.textContent = "";

    // image
    const img = document.createElement("img");
    img.src = avatarUrl;
    img.alt = "User Image";
    img.classList.add("img-circle");
    githubOutput.appendChild(img);

    // display name
    const pName = document.createElement("p");
    const bold = document.createElement("strong");
    if (!name) {
        bold.textContent = `@${login}`;
    } else {
        bold.textContent = `${name} - @${login}`;
    }
    pName.appendChild(bold) 
    githubOutput.appendChild(pName);

    // bio
    if (bio) {
        const pBio = document.createElement("p");
        pBio.textContent = bio;
        pBio.classList.add("bio");
        githubOutput.appendChild(pBio);
    }

    // stats
    const pStats = document.createElement("p");
    pStats.textContent = `Public repos: ${repos}`;
    githubOutput.appendChild(pStats);

    // link
    const a = document.createElement("a");
    a.text = "View profile";
    a.href = htmlUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    githubOutput.appendChild(a);
}


// Dog Card

async function handleGetDog() {
    // loading state: get image, disable btn
    dogBtn.disabled = true;
    dogOutput.textContent = "Fetching doggie image...";

    // fetch image
    const imageURL = await fetchRandomDog();
    if (!imageURL) {
        dogOutput.textContent = "Could not fetch doggie image. Try again.";
        dogBtn.disabled = false;
        return;
    }

    renderDogSuccess(imageURL);
    dogBtn.disabled = false; 
}

// Gets dog image
async function fetchRandomDog() {
    try {
        const response = await fetch ('https://random.dog/woof.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const url = data.url;

        if (!url) {
            return null;
        }
        
        const lowerURL = url.toLowerCase();
        if (lowerURL.endsWith(".mp4") || lowerURL.endsWith(".webm") || lowerURL.endsWith(".mov")) {
            return null;
        } else {
            return url;
        }
    } catch (error) {
        console.error("Image fetch failed:", error);
        return null;
    }
}

// Displays dog image
function renderDogSuccess(url) {
    dogOutput.textContent = "";

    const img = document.createElement("img");
    img.src = url;
    img.alt = "Random dog image";

    const p = document.createElement("p");
    const small = document.createElement("small");
    const span = document.createElement("span");
    span.setAttribute("aria-label", "Date source");
    span.textContent = "ⓘ Random Dog";

    small.appendChild(span);
    p.appendChild(small);

    dogOutput.appendChild(img);
    dogOutput.appendChild(p);
}


// Joke Card

async function handleGetjoke() {
    // loading state:
    jokeBtn.disabled = true;
    jokeOutput.textContent = "Fetching joke...";

    // fetch joke
    const joke = await fetchJoke();
    if (!joke) {
        jokeOutput.textContent = "Could not fetch joke. Try again.";
        jokeBtn.disabled = false;
        return;
    }

    renderJokeSuccess(joke);
    jokeBtn.disabled = false;
}

// Gets joke
async function fetchJoke() {
    try {
        const response = await fetch ('https://official-joke-api.appspot.com/random_joke');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const setup = data.setup;
        const punchline = data.punchline;

        if (!data) {
            return null;
        } else {
            return {setup, punchline};
        }

    } catch (error) {
        console.error("Joke fetch failed:", error);
        return null;
    }
}

// Displays joke
function renderJokeSuccess(joke) {
    const { setup, punchline } = joke;
    
    jokeOutput.textContent = "";

    jokeOutput.innerHTML = `
        <p><strong>${setup}</strong></p>
        <p>✨${punchline}✨</p>
        <p><small><span aria-label="Data source">ⓘ Official API Joke</span></small></p>
    `;
}


// Dictionary Card

async function handleGetDefinition() {
    const userWord = dictWord.value.trim();
    if (userWord === "") {
        dictOutput.textContent = "Please enter a word.";
        return;
    }

    // loading state
    dictBtn.disabled = true;
    dictOutput.textContent = 'Fetching definition...';

    // fetch definition
    const definition = await fetchDefinition(userWord);
    if (definition?.notFound) {
        dictOutput.textContent = "Word not found."
        dictBtn.disabled = false;
        return;
    }
    else if (!definition) {
        dictOutput.textContent = "Could not fetch definition data. Try again.";
        dictBtn.disabled = false;
        return;
    }

    renderDefinitionSuccess(definition);
    dictBtn.disabled = false;
}

// Get definition
async function fetchDefinition(userWord) {
    try {
        const response = await fetch (`https://api.dictionaryapi.dev/api/v2/entries/en/${userWord}`);

        if (response.status === 404) {
            return {notFound: true}; 
        }
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const entry = data[0];

        if (!entry || !Array.isArray(entry.meanings) || entry.meanings.length === 0) {
            return null;
        }

        const word = entry.word;
        const partOfSpeech = entry.meanings[0].partOfSpeech;
        const definition = entry.meanings[0].definitions[0]?.definition;
        const partOfSpeech2 = entry.meanings[1]?.partOfSpeech;
        const definition2 = entry.meanings[1]?.definitions[0]?.definition;

        return {word, partOfSpeech, definition, partOfSpeech2, definition2};
    } catch (error) {
        console.error("Definition fetch failed:", error);
        return null;
    }
}

// Display definition
function renderDefinitionSuccess(entry) {
    const { word, partOfSpeech, definition, partOfSpeech2, definition2 } = entry;

    dictOutput.textContent = "";

    const p1 = document.createElement("p");
    const boldP1 = document.createElement("strong");
    boldP1.textContent = word;
    p1.appendChild(boldP1);
    dictOutput.appendChild(p1);

    const p2 = document.createElement("p");
    const boldP2 = document.createElement("strong");
    if (partOfSpeech) {
        boldP2.textContent = `${partOfSpeech}: `;
    } else {
        boldP2.textContent = "Definition: ";
    }
    p2.appendChild(boldP2);
    p2.appendChild(document.createTextNode(definition));
    dictOutput.appendChild(p2);

    if (partOfSpeech2 && definition2) {
        const p3 = document.createElement("p");
        const boldP3 = document.createElement("strong");
        boldP3.textContent = partOfSpeech2 + ": ";
        p3.appendChild(boldP3);
        p3.appendChild(document.createTextNode(definition2));
        dictOutput.appendChild(p3);
    }

    const source = document.createElement("p");
    const small = document.createElement("small");
    const span = document.createElement("span");
    span.setAttribute("aria-label", "Data source");
    span.textContent = "ⓘ DictionaryAPI";
    small.appendChild(span);
    source.appendChild(small);
    dictOutput.appendChild(source);
}


// Anime Card

async function handleGetAnime() {
    const userTitle = animeTitle.value.trim();
    if (userTitle === "") {
        animeOutput.textContent = "Please enter an anime title."
        return;
    }

    // loading state
    animeBtn.disabled = true;
    animeOutput.textContent = 'Fetching anime information...';

    // fetch anime
    const details = await fetchAnime(userTitle);
    if (details?.notFound) {
        animeOutput.textContent = "Anime not found."
        animeBtn.disabled = false;
        return;
    }
    else if (!details) {
        animeOutput.textContent = "Could not fetch anime data. Try again."
        animeBtn.disabled = false;
        return;
    }

    renderAnimeSuccess(details);
    animeBtn.disabled = false;
}

// Gets details
async function fetchAnime(animeTitle) {
    try {
        const response = await fetch (`https://api.jikan.moe/v4/anime?q=${animeTitle}&limit=1&sfw=true`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.data.length === 0) {
            return {notFound: true}; 
        }

        const title = data.data[0].title;
        const imageUrl = data.data[0].images.jpg.image_url;
        const synopsis = data.data[0].synopsis;
        const score = data.data[0].score;
        const url = data.data[0].url

        return {title, imageUrl, synopsis, score, url}
    } catch (error) {
        console.error("Anime fetch failed:", error);
        return null;
    }
}

// Displays information
function renderAnimeSuccess(anime) {
    const { title, imageUrl, synopsis, score, url } = anime
    animeOutput.textContent = "";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = `Poster for ${title}`;
    img.referrerPolicy = "no-referrer";
    animeOutput.appendChild(img);

    const pTitle = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = title;
    pTitle.appendChild(strong);
    animeOutput.appendChild(pTitle);

    if (typeof score === "number") {
        const pScore = document.createElement("p");
        pScore.textContent = `Score: ${score}/10`;
        animeOutput.appendChild(pScore);
    }

    if (synopsis) {
        const pSynopsis = document.createElement("p");
        pSynopsis.textContent = synopsis;
        pSynopsis.classList.add("synopsis");
        animeOutput.appendChild(pSynopsis);
    }

    if (url) {
        const a = document.createElement("a");
        a.text = "More Info"
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        animeOutput.appendChild(a);
    }

    const source = document.createElement("p");
    const small = document.createElement("small");
    const span = document.createElement("span");
    span.setAttribute("aria-label", "Data source");
    span.textContent = "ⓘ MyAnimeList via Jikan";
    small.appendChild(span);
    source.appendChild(small);
    animeOutput.appendChild(source);
}


// Numbers Card

async function handleGetNumFact() {
    const userType = numType.value;

    // loading state
    numBtn.disabled = true;
    numOutput.textContent = "Fetching fact...";

    // fetch fact 
    const fact = await fetchNumberFact(userType);
    if(!fact) {
        numOutput.textContent = "Could not fetch fact. Try again.";
        numBtn.disabled = false;
        return;
    }

    renderNumberFactSuccess(fact);
    numBtn.disabled = false;
}

// Get fact
async function fetchNumberFact(type) {
    try {
        // const response = await fetch (`http://numbersapi.com/random/${type}`);
        const isHttps = location.protocol === "https:";
        const endpoint = isHttps
            ? `https://api.allorigins.win/raw?url=http://numbersapi.com/random/${type}`
            : `http://numbersapi.com/random/${type}`;

        const response = await fetch(endpoint, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();

        return {text: data, type};
    } catch (error) {
        console.error("Fact fetch failed:", error);
        return null;
    }
}

// Display fact
function renderNumberFactSuccess(fact) {
    const { text: data, type } = fact;
    
    numOutput.textContent = "";

    numOutput.innerHTML = `
        <p><strong>${type}: </strong>${data}</p>
        <p><small><span aria-label="Data source">ⓘ NumbersAPI</span></small></p>
    `;
}


weatherBtn.addEventListener("click", handleGetWeather);
currencyBtn.addEventListener("click", handleGetRates);
githubBtn.addEventListener("click", handleGetGitHub);
dogBtn.addEventListener("click", handleGetDog);
jokeBtn.addEventListener("click", handleGetjoke);
dictBtn.addEventListener("click", handleGetDefinition);
animeBtn.addEventListener("click", handleGetAnime);
numBtn.addEventListener("click", handleGetNumFact);