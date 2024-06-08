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
