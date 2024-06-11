document.getElementById('settingsButton').addEventListener('click', function() {
    document.getElementById('settingsModal').style.display = 'block';
});

document.getElementsByClassName('close')[0].addEventListener('click', function() {
    document.getElementById('settingsModal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('settingsModal')) {
        document.getElementById('settingsModal').style.display = 'none';
    }
});

document.getElementById('theme').addEventListener('change', function() {
    if (this.value === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

document.getElementById('colorBlindMode').addEventListener('change', function() {
    document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (this.value !== 'none') {
        document.body.classList.add(this.value);
    }
});

document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    const apiKey = 'b082950322711563d18cbf40f661c983ad39a5812f48a5682abda473edb60e8e';
    const url = `https://api.ambeedata.com/weather/forecast/daily?city=${city}&days=7`;

    fetch(url, {
        headers: {
            'x-api-key': apiKey,
            'Content-type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data) {
            const forecastData = data.data.forecast.map(day => `
                <div class="day-forecast">
                    <h3>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                    <img src="placeholder.png" alt="${day.weather}">
                    <p>Temp: ${day.temperature.max}°C / ${day.temperature.min}°C</p>
                    <p>${day.weather}</p>
                </div>
            `).join('');
            document.getElementById('forecast').innerHTML = forecastData;
            document.getElementById('error').innerHTML = '';
        } else {
            document.getElementById('error').innerHTML = 'City not found. Please try again.';
            document.getElementById('forecast').innerHTML = '';
        }
    })
    .catch(error => {
        document.getElementById('error').innerHTML = 'An error occurred. Please try again.';
        document.getElementById('forecast').innerHTML = '';
    });
});
