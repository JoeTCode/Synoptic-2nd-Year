var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../passport-config');
const { getWeatherData } = require('../controllers/weatherController');
const { getHourlyWeatherData } = require('../controllers/weatherController');



/* GET Weather page. */
router.get('/', checkAuthenticated, async function(req, res, next) { 
    const weatherData = await getWeatherData();
    const hourlyWeatherData = await getHourlyWeatherData();
    res.render('weather', { title: 'Weather', 'weatherData': weatherData, 'hourlyWeatherData': hourlyWeatherData });
});



module.exports = router;