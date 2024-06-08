# SYNOPTIC-2ND-YEAR-PROJECT

# LOGIN:

# username is 'admin1', password is 'pass'
# to change these details go to login.js in routes, and change the values inside:

# const hashedPassword = await bcrypt.hash('pass', 10);

# AND:

# await pool.query('INSERT INTO admins (name, password, phone_number) 
# VALUES ($1, $2, $3)', ['admin1', hashedPassword,'+855 22 324 3949'])

# accordingly