const { fetchWeatherApi } = require('openmeteo');
const { sendMessage } = require('./messageController');
const { sendForecastMessage } = require('./messageController');
const pool = require('../database');

const params = {
    "latitude": 12.57633758416416,
    "longitude": 106.93316285065214,
    "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "precipitation_sum", "precipitation_hours"],
    "timezone": "auto"
};

const url = "https://api.open-meteo.com/v1/forecast";

async function getWeatherData() {
    try {
        const responses = await fetchWeatherApi(url, params);

        // Helper function to form time ranges
        const range = (start, stop, step) => 
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();

        const daily = response.daily();

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                weatherCode: daily.variables(0).valuesArray(),
                temperature2mMax: daily.variables(1).valuesArray(),
                temperature2mMin: daily.variables(2).valuesArray(),
                precipitationSum: daily.variables(3).valuesArray(),
                precipitationHours: daily.variables(4).valuesArray(),
            },
        };

        // `weatherData` now contains a simple structure with arrays for datetime and weather data
        // console.log('Weather data');
        // for (let i = 0; i < weatherData.daily.time.length; i++) {
        //     console.log(
        //         weatherData.daily.time[i].toISOString(),
        //         weatherData.daily.weatherCode[i],
        //         weatherData.daily.temperature2mMax[i],
        //         weatherData.daily.temperature2mMin[i],
        //         weatherData.daily.precipitationSum[i],
        //         weatherData.daily.precipitationHours[i]
        //     );
        // }
        return {
            'date': weatherData.daily.time,
            'code': weatherData.daily.weatherCode,
            'temp_max': weatherData.daily.temperature2mMax,
            'temp_min': weatherData.daily.temperature2mMin,
            'precipitation_sum': weatherData.daily.precipitationSum,
            'precipitation_hours': weatherData.daily.precipitationHours
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

//getWeatherData(); 

const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    56: 'Light Freezing Drizzle',
    57: 'Dense Freezing Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    66: 'Light Freezing Rain',
    67: 'Heavy Freezing Rain',
    71: 'Slight Snow fall',
    73: 'Moderate Snow fall',
    75: 'Heavy Snow fall',
    77: 'Snow grains',
    80: 'Slight Rain showers',
    81: 'Moderate Rain showers',
    82: 'Violent Rain showers',
    85: 'Slight Snow showers',
    86: 'Heavy Snow showers',
    95: 'Slight or Moderate Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
};

async function sendDailyForecast() {
    const data = await getWeatherData();
    const returnObj = await pool.query('SELECT date FROM daily_weather WHERE id = 1');
    const dateObj = returnObj.rows[0].date;
    const dateToCompare = dateObj ? new Date(dateObj) : new Date('00-01-1999');
    const firstValue = 0;
    const now = new Date();

    const description = weatherCodes[data.code[firstValue]];
    const date = new Date(data.date[firstValue]);
    const precip_sum = data.precipitation_sum[firstValue].toFixed(2);
    const max_temp = parseInt(data.temp_max[firstValue]);
    const min_temp = parseInt(data.temp_min[firstValue]);
 
    if (dateToCompare.getDate() === date.getDate()) {
        return 0;
    }
    if (dateToCompare.getDate() !== date.getDate()) {
        if (now.getDate() == date.getDate()) {
            const message = `${description}, ${precip_sum}mm of rain, high of ${max_temp}°C, low of: ${min_temp}°C`;
            console.log(message);
            await pool.query('DELETE FROM daily_weather WHERE id = 1');
            await pool.query('INSERT INTO daily_weather VALUES(1, $1)', [date.toISOString().split('T')[0]]);
            sendForecastMessage(message);
            
        } else {
            console.error('Could not find weather data for today');
            console.log(dateToCompare);
            console.log(date);
            console.log(now);
        }
    } else {
        console.log(dateToCompare);

    }
}
sendDailyForecast();


// below is the api code to grab the nearby rivers discharge rate (rate of flow in m/s^3)
// the latitude and logitude provided matches with Pu Ngaol
const flood_params = {
    "latitude": 12.57633758416416,
    "longitude": 106.93316285065214,
    "daily": ["river_discharge", "river_discharge_mean"]
};

const flood_url = 'https://flood-api.open-meteo.com/v1/flood';

async function getFloodData() {
    try {
        const responses = await fetchWeatherApi(flood_url, flood_params);

        // Helper function to form time ranges
        const range = (start, stop, step) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();

        const daily = response.daily();

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    t => new Date((t + utcOffsetSeconds) * 1000)
                ),
                riverDischarge: daily.variables(0).valuesArray(),
                riverDischargeMean: daily.variables(1).valuesArray(),
            },
        };

        // instead of logging all the data in a loop (commented code before catch block),
        // it is returned as an object to be manipulated in the function below this one
        console.log('Flood data');
        return { 
            date: weatherData.daily.time,
            discharge: weatherData.daily.riverDischarge,
            mean_discharge: weatherData.daily.riverDischargeMean
        }

        // for (let i = 0; i < weatherData.daily.time.length; i++) {
        //     console.log(
        //         weatherData.daily.time[i].toISOString(),
        //         weatherData.daily.riverDischarge[i],
        //         weatherData.daily.riverDischargeMean[i]
        //     );
        // }

    } catch (error) {
        console.error('Error fetching flood data:', error);
    }
}

async function produceFloodWarningMessage() {
    data = await getFloodData();
    let array = []; // holds the total areas of high discharge rates
    let sub_array = []; // holds areas of high river discharge rates
    // flood_risk_multiplier determines what is considered a 'high river discharge rate' aka flood risk.
    // 1.5 times multiplier was chosen as an estimation for a flood risk, can be changed if there is a better
    // prediction.
    const flood_risk_multiplier = 1.5;
    for (let i=0; i<data.mean_discharge.length; i++) {
        if (data.discharge[i] >= data.mean_discharge[i]*flood_risk_multiplier) {
            sub_array.push({'date': data.date[i], 'discharge': data.discharge[i]});
        }
        if (data.discharge[i] < data.mean_discharge[i]*flood_risk_multiplier) {
            if (sub_array.length !== 0) {
                array.push(sub_array);
            }
            sub_array = [];
        }
    }
    // log statement for test purposes
    console.log(array);
    // selects the first and last value of each discharge peak
    flood_warnings = [];
    array.forEach(discharge_peak => {
        const discharge_peak_object = discharge_peak[0];
        const start_date = discharge_peak_object.date;
        const end_date = discharge_peak[discharge_peak.length-1].date;
        //flood_warnings.push(`Warning, high chance of flood on: ${start_date} to: ${end_date}`);
        flood_warnings.push([start_date, end_date]);
    })
    return flood_warnings;
}
produceFloodWarningMessage().then(flood_warnings => {
    // for demonstration purposes, set override to true when you want to see the results of the
    // function. (it will disregard the dates of the flood risks, and send all flood risk data)
    const override = false; 
    const now = new Date().toISOString().split('T')[0];
    flood_warnings.forEach(warning => {
        let start = warning[0].toISOString().split('T')[0];

        let start_split = warning[0].toString().split(' ');
        let end_split = warning[1].toString().split(' ');
        let formattedStart = [start_split[0], start_split[1], start_split[2]].join(' ');
        let formattedEnd = [end_split[0], end_split[1], end_split[2]].join(' ');

        if (start === now || override) {
            sendMessage('Flood Warning', `High chance of flood on: ${formattedStart} to: ${formattedEnd}`)
        }
    })
})


const hourly_params = {
	"latitude": 12.57633758416416,
	"longitude": 106.93316285065214,
	"hourly": ["temperature_2m", "precipitation_probability", "weather_code"],
	"forecast_days": 1
};
const hourly_url = "https://api.open-meteo.com/v1/forecast";

async function getHourlyWeatherData() {
    const responses = await fetchWeatherApi(hourly_url, hourly_params);
    // Helper function to form time ranges
    const range = (start, stop, step) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const hourly = response.hourly();

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {

        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0).valuesArray(),
            precipitationProbability: hourly.variables(1).valuesArray(),
            weatherCode: hourly.variables(2).valuesArray(),
        },

    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    // console.log('hourly');
    // for (let i = 0; i < weatherData.hourly.time.length; i++) {
    //     console.log(
    //         weatherData.hourly.time[i].toISOString(),
    //         weatherData.hourly.temperature2m[i],
    //         weatherData.hourly.precipitationProbability[i],
    //         weatherData.hourly.weatherCode[i]
    //     );
    // }
    return {
        'date': weatherData.hourly.time,
        'temp': weatherData.hourly.temperature2m,
        'precipitation_prob': weatherData.hourly.precipitationProbability,
        'code': weatherData.hourly.weatherCode
    }
}


module.exports = {
    getWeatherData,
    getHourlyWeatherData
}

