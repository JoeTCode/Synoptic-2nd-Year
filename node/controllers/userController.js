
const pool = require('../database');
const bcrypt = require('bcrypt');

// Get all users
async function getUsers(req, res) {
    try {
        // Get all users from the database
        const result = await pool.query('SELECT * FROM users ORDER BY uid');
        res.render('manageUsers', { title: 'Manage Users', users: result.rows });
    } catch (err) {
        console.error(err);
        res.render('manageUsers', { title: 'Manage Users', users: [] });
    }
}

// Add a new user
async function addUser(req, res) {
    const { name, phone_number, location } = req.body;
    try {
        await pool.query(
            // Insert a new user into the database
            'INSERT INTO users (name, phone_number, location) VALUES ($1, $2, $3)', 
            [name, phone_number, location ]
        );
        res.redirect('/manage-users');
    } catch (err) {
        console.error(err);
        res.redirect('/manage-users');
    }
}

// Delete a user
async function deleteUser(req, res) {
    const { uid } = req.body;
    try {
        // Delete the user from the database
        await pool.query('DELETE FROM users WHERE uid = $1', [uid]);
        res.redirect('/manage-users');
    } catch (err) {
        console.error(err);
        res.redirect('/manage-users');
    }
}

module.exports = {
    getUsers,
    addUser,
    deleteUser
};
