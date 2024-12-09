export async function fetchWeather(city) {
    const API_KEY = 'c323b62d0a033189a65f0c2c795e89eb';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=en`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
        }
        const data = await response.json(); // Ensure to declare and return data here
        console.log('Fetched weather data:', data); // Output debugging information
        return data;
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        throw error;
    }
}

export function displayWeather(data, containerId) {
    const weatherContainer = document.getElementById(containerId);

    if (!weatherContainer) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    weatherContainer.innerHTML = `
        <h3>${data.name || 'N/A'}, ${data.sys?.country || 'N/A'}</h3>
        <p>Temperature: ${data.main?.temp || 'N/A'}°C</p>
        <p>Weather: ${data.weather?.[0]?.description || 'N/A'}</p>
        <p>Humidity: ${data.main?.humidity || 'N/A'}%</p>
        <p>Wind Speed: ${data.wind?.speed || 'N/A'} m/s</p>
    `;
}

// Bind weather query feature
export function initializeWeatherFeature() {
    const fetchButton = document.getElementById('fetchWeatherButton');
    const cityInput = document.getElementById('cityInput');
    const weatherContainerId = 'weatherContainer';

    if (!fetchButton || !cityInput) {
        console.error('HTML elements not found.');
        return;
    }

    fetchButton.addEventListener('click', async () => {
        const city = cityInput.value.trim();
        if (!city) {
            alert('Please enter a city name.');
            return;
        }

        try {
            const weatherData = await fetchWeather(city);
            displayWeather(weatherData, weatherContainerId);
        } catch (error) {
            const weatherContainer = document.getElementById(weatherContainerId);
            if (weatherContainer) {
                weatherContainer.innerText = error.message;
            }
        }
    });
}
