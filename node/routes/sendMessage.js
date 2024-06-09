var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../passport-config');
const messageController = require('../controllers/messageController');

/* GET Send Message page. */
router.get('/', checkAuthenticated, async function(req, res, next) {
    try {
        const alerts = await messageController.getCurrentAlerts();
        res.render('sendMessage', { title: 'Send Message', currentAlerts: alerts });
    } catch (err) {
        console.error(err);
        res.render('sendMessage', { title: 'Send Message', currentAlerts: [] });
    }
});

router.post('/', checkAuthenticated, async function(req, res, next) {
    const { alertType, message } = req.body;
    try {
        await messageController.sendMessage(alertType, message);
        res.redirect('/send-message');
    } catch (err) {
        console.error(err);
        res.redirect('/send-message');
    }
});

module.exports = router;
