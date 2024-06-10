const twilio = require('twilio');
const pool = require('../database');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

async function sendMessage(alertType, message) {
    const fullMessage = `${alertType}: ${message}`;
    try {
        // Send SMS to all users
        const users = await pool.query('SELECT phone_number FROM users');
        users.rows.forEach(user => {
            client.messages.create({
                body: fullMessage,
                from: twilioPhoneNumber,
                to: user.phone_number
            }).then(message => console.log(message.sid))
              .catch(error => console.error(error));
        });

        // Insert the alert into the database
        const now = new Date();
        await pool.query('INSERT INTO currentAlerts (created_at, message) VALUES ($1, $2)', [now, fullMessage]);

    } catch (err) {
        console.error(err);
        throw new Error('Failed to send message and save alert.');
    }
}

async function sendForecastMessage(forecastMessage) {
    const fullMessage = `Forecast: ${forecastMessage}`;
    try {
        // Send SMS to all users
        const users = await pool.query('SELECT phone_number FROM users');
        users.rows.forEach(user => {
            client.messages.create({
                body: fullMessage,
                from: twilioPhoneNumber,
                to: user.phone_number
            }).then(message => console.log(message.sid))
              .catch(error => console.error(error));
        });
    } catch (err) {
        console.error(err);
        throw new Error('Failed to send forecast message.');
    }
}

async function getCurrentAlerts() {
    try {
        const alerts = await pool.query('SELECT * FROM currentAlerts ORDER BY created_at DESC LIMIT 5');
        return alerts.rows;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve current alerts.');
    }
}

module.exports = {
    sendMessage,
    getCurrentAlerts
};
