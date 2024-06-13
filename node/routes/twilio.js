// routes/twilio.js
var express = require('express');
var router = express.Router();
const pool = require('../database');
const moment = require('moment');

router.post('/webhook', async (req, res) => {
    console.log(req.body);  // Log incoming request for debugging
    const { From, Body } = req.body;
    try {
        //Receives a message from user and saves it to the database
        const userResult = await pool.query('SELECT name FROM users WHERE phone_number = $1', [From]);
        if (userResult.rows.length > 0) {
            const fullName = userResult.rows[0].name;
            const sentAt = moment().format('YYYY-MM-DD HH:mm:ss');
            await pool.query('INSERT INTO userAlerts (sent_at, phone_number, full_name, message) VALUES ($1, $2, $3, $4)', [sentAt, From, fullName, Body]);
            res.status(200).send('Message received');
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
