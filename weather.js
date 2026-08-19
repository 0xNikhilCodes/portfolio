// ======================================
// WEATHER DASHBOARD
// ======================================

const weatherForm = document.getElementById("weather-form");

const cityInput = document.getElementById("city-input");

const weatherResult = document.getElementById("weather-result");

const weatherError = document.getElementById("weather-error");

const weatherLoading = document.getElementById("weather-loading");

const weatherCity = document.getElementById("weather-city");

const weatherTemperature =
    document.getElementById("weather-temperature");

const weatherHumidity =
    document.getElementById("weather-humidity");

const weatherWind =
    document.getElementById("weather-wind");

const weatherCondition =
    document.getElementById("weather-condition");


// ======================================
// FORM SUBMISSION
// ======================================

weatherForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        return;
    }

    await getWeather(city);

});


// ======================================
// FETCH WEATHER
// ======================================

async function getWeather(city) {

    weatherError.hidden = true;

    weatherResult.hidden = true;

    weatherLoading.hidden = false;


    try {

        // First find the city coordinates

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );


        if (!geoResponse.ok) {

            throw new Error(
                "Unable to connect to the weather service."
            );

        }


        const geoData = await geoResponse.json();


        if (!geoData.results || geoData.results.length === 0) {

            throw new Error(
                "City not found. Please check the city name."
            );

        }


        const location = geoData.results[0];


        // Get weather using coordinates

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to retrieve weather data."
            );

        }


        const weatherData = await weatherResponse.json();


        // Render data

        displayWeather(location, weatherData);


    } catch (error) {

        showError(error.message);

    } finally {

        weatherLoading.hidden = true;

    }

}


// ======================================
// DISPLAY WEATHER
// ======================================

function displayWeather(location, data) {

    const current = data.current;


    weatherCity.textContent =
        `${location.name}, ${location.country}`;


    weatherTemperature.textContent =
        `${current.temperature_2m} °C`;


    weatherHumidity.textContent =
        `${current.relative_humidity_2m}%`;


    weatherWind.textContent =
        `${current.wind_speed_10m} km/h`;


    weatherCondition.textContent =
        getWeatherDescription(current.weather_code);


    weatherResult.hidden = false;

}


// ======================================
// WEATHER CODE
// ======================================

function getWeatherDescription(code) {

    const weatherCodes = {

        0: "Clear sky",

        1: "Mainly clear",

        2: "Partly cloudy",

        3: "Overcast",

        45: "Fog",

        48: "Depositing rime fog",

        51: "Light drizzle",

        53: "Moderate drizzle",

        55: "Dense drizzle",

        61: "Slight rain",

        63: "Moderate rain",

        65: "Heavy rain",

        71: "Slight snow",

        73: "Moderate snow",

        75: "Heavy snow",

        80: "Slight rain showers",

        81: "Moderate rain showers",

        82: "Violent rain showers",

        95: "Thunderstorm",

        96: "Thunderstorm with hail",

        99: "Thunderstorm with heavy hail"

    };


    return weatherCodes[code] || "Unknown weather";

}


// ======================================
// ERROR HANDLING
// ======================================

function showError(message) {

    weatherError.textContent = message;

    weatherError.hidden = false;

    weatherResult.hidden = true;

}
