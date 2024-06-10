const { fetchWeatherApi } = require('openmeteo');
const { sendMessage } = require('./messageController');
const params = {
    "latitude": 12.57633758416416,
    "longitude": 106.93316285065214,
    "hourly": "temperature_2m",
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

        const hourly = response.hourly();

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables(0).valuesArray(),
            },
        };

        // `weatherData` now contains a simple structure with arrays for datetime and weather data
        console.log('Weather data');
        for (let i = 0; i < weatherData.hourly.time.length; i++) {
            console.log(
                weatherData.hourly.time[i].toISOString(),
                weatherData.hourly.temperature2m[i]
            );
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

//getWeatherData(); // commented out for time being

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
        return { date: weatherData.daily.time,
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




