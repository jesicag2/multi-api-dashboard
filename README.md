# API Dashboard

## Description
This project is an interactive API Dashboard built with HTML, CSS, and JavaScript. This projext demonstrates proficiency in front-end web development and working with third-party APIs.

The dashboard features eight functional cards, each fetching and displaying live data from a different public APIs. It emphasizes modular JavaScript (separating handler, fetcher, and renderer logic), accessibility (ARIA attributes, alt text, semantic structure), and responsive design.

Check out live demo [here](https://multiapidash.netlify.app/).

## How to View the Project
1. Download or clone the repository.
2. Open `index.html` in any modern browser (e.g., Chrome, Firefox, Safari).
3. No API keys are required — all APIs used are free and public.

## Features
- Responsive dashboard layout with multiple interactive cards.
- Button disable/enable during fetch for consistent UX.
- Clear loading and error states across all cards.
- Accessibility: aria-live regions for updates, alt text for images, semantic HTML structure.

## How to Use
- **Weather Card** — Enter a city and click *Get Weather* to see current temperature, feels like, and daily high/low.  
- **Currency Converter** — Enter an amount, select currencies, and click *Convert* to see live exchange rates.  
- **GitHub User** — Enter a GitHub username and click *Get User* to see profile info, bio, and repos.  
- **Random Dog** — Click *Get Dog* to see a random dog picture or gif.  
- **Joke Generator** — Click *Get Joke* to see a random joke.  
- **Dictionary** — Enter a word and click *Get Definition* to see part of speech + definitions.  
- **Anime Finder** — Enter an anime title and click *Find Anime* to see poster, score, and synopsis.  
- **Numbers** — Select *Trivia* or *Math* from the dropdown and click *Get Fact* to see a random number fact.  

## Files Included
- `index.html` – Main HTML structure for the dashboard.
- `styles.css` – CSS styling for cards, layout, and responsive design.
- `script.js` – JavaScript logic (handlers, fetchers, renderers for each card).
- `README.md` – This file.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Public APIs (Open-Meteo, VATComply, GitHub API, Random Dog, Joke API, Dictionary API, Jikan/MAL API, Numbers API)

## Credits
This project uses the following public APIs:  
- [Open-Meteo](https://open-meteo.com/) — Weather data  
- [VATComply](https://www.vatcomply.com/documentation#rates) — Currency exchange rates  
- [GitHub API](https://docs.github.com/en/rest) — GitHub user profiles  
- [Random Dog](https://random.dog/) — Random dog images  
- [Official Joke API](https://github.com/15Dkatz/official_joke_api) — Random jokes  
- [Free Dictionary API](https://dictionaryapi.dev/) — Word definitions  
- [Jikan API](https://jikan.moe/) — Anime data (MyAnimeList)  
- [Numbers API](http://numbersapi.com/) — Trivia and math facts

## Author
Jesica Garcia – https://github.com/jesicag2
