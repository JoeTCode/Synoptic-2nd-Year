# SYNOPTIC-2ND-YEAR-PROJECT

Docker commands:

'docker compose down' - decomposes containers\
'docker compose down -v' - decomposes containers and deletes persistant database data (Do this after making/receiving changes to the database folder)\
'docker compose up --build' - builds containers

# LOGIN:

username is 'admin1', password is 'pass'\
to change these details go to login.js in routes, and change the values inside:

const hashedPassword = await bcrypt.hash('pass', 10);

await pool.query('INSERT INTO admins (name, password, phone_number) \
VALUES ($1, $2, $3)', ['admin1', hashedPassword,'+855 22 324 3949'])

accordingly.

# TESTING:

For the SMS testing of the weatherController: 
-   Set 'override' to 'true', on the first few lines in weatherController.js
    to always send avaialble flood data via SMS on startup regardless of the date of the flood.
-   To send todays forecast via SMS, you must recreate the database via -v, then build.
    It will not resend todays forecast until you recreate the database again, this is to avoid
    continous sending of data on page refresh.

