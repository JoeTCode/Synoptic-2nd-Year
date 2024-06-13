// routes/alerts.js
var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../passport-config');
const pool = require('../database');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

/* GET Alerts page. */
router.get('/', checkAuthenticated, async function(req, res, next) {
    try {
        const alerts = await pool.query('SELECT * FROM userAlerts ORDER BY sent_at DESC');
        res.render('alerts', { title: 'Alerts', alerts: alerts.rows });
    } catch (err) {
        console.error(err);
        res.render('alerts', { title: 'Alerts', alerts: [] });
    }
});

router.post('/send', checkAuthenticated, async function(req, res, next) {
    const { id } = req.body;
    try {
        // Sends the alert to all users
        const alert = await pool.query('SELECT message FROM userAlerts WHERE id = $1', [id]);
        if (alert.rows.length > 0) {
            const message = alert.rows[0].message;
            const users = await pool.query('SELECT phone_number FROM users');
            const promises = users.rows.map(user => {
                return client.messages.create({
                    body: message,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: user.phone_number
                });
            });
            await Promise.all(promises);
            await pool.query('DELETE FROM userAlerts WHERE id = $1', [id]);
        }
        res.redirect('/alerts');
    } catch (err) {
        console.error(err);
        res.redirect('/alerts');
    }
});

router.post('/delete', checkAuthenticated, async function(req, res, next) {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM userAlerts WHERE id = $1', [id]);
        res.redirect('/alerts');
    } catch (err) {
        console.error(err);
        res.redirect('/alerts');
    }
});

module.exports = router;
