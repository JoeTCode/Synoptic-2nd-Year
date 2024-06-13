CREATE TABLE IF NOT EXISTS test (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- Admin details
CREATE TABLE IF NOT EXISTS admins (
    admin_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL
);

-- User details
CREATE TABLE IF NOT EXISTS users (
    uid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    location VARCHAR(255)
);

-- Alerts that have been sent out
CREATE TABLE IF NOT EXISTS currentAlerts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    message TEXT NOT NULL
);

-- Alerts that are incoming from users
CREATE TABLE IF NOT EXISTS userAlerts (
    id SERIAL PRIMARY KEY,
    sent_at TIMESTAMP NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL
);

-- Daily weather data
CREATE TABLE IF NOT EXISTS daily_weather (
    id INT PRIMARY KEY,
    date DATE
);