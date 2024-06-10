INSERT INTO test (name) VALUES ('Test Data 1'), ('Test Data 2');

INSERT INTO users (name, phone_number, location) VALUES 
('Pang Sotear', '+855 22 324 3945', 'Place 1'),
('Sen Rath', '+855 22 324 3429', 'Place 2'),
('Aang Sros', '+855 22 324 3415', 'Place 3'),
('Um Sopath', '+855 22 324 3025', 'Place 4'),
('Chea Kunthea', '+855 22 324 3935', 'Place 5'),
('Nourn Chhaya', '+855 22 324 3900', 'Place 6'),
('Eam Somnang', '+855 22 324 3800', 'Place 7'),
('Loun Akara', '+855 22 324 3140', 'Place 8'),
('Saluk Poeu', '+855 22 324 3451', 'Place 9'),
('Khai Sothiya', '+855 22 324 2144', 'Place 10'),
('Uch Anchaly', '+855 22 324 3047', 'Place 11');

INSERT INTO currentAlerts (created_at, message) VALUES 
(NOW(), 'Road Block: Test Alert 1'),
(NOW(), 'Forest: Test Alert 2'),
(NOW(), 'Water: Test Alert 3'),
(NOW(), 'Extreme Weather: Test Alert 4'),
(NOW(), 'Custom: Test Alert 5');

INSERT INTO userAlerts (sent_at, phone_number, full_name, message) VALUES 
('2023-06-01 12:30:00', '+855 22 324 3945', 'Pang Sotear', 'Emergency alert: Flood warning in Place 1.'),
('2023-06-01 13:00:00', '+855 22 324 3429', 'Sen Rath', 'Emergency alert: Road blockage in Place 2.'),
('2023-06-01 14:30:00', '+855 22 324 3415', 'Aang Sros', 'Emergency alert: Fire hazard in Place 3.'),
('2023-06-01 15:00:00', '+855 22 324 3025', 'Um Sopath', 'Emergency alert: Power outage in Place 4.'),
('2023-06-01 16:30:00', '+855 22 324 3935', 'Chea Kunthea', 'Emergency alert: Earthquake detected in Place 5.'),
('2023-06-01 17:00:00', '+855 22 324 3900', 'Nourn Chhaya', 'Emergency alert: Landslide warning in Place 6.'),
('2023-06-01 18:30:00', '+855 22 324 3800', 'Eam Somnang', 'Emergency alert: Severe weather in Place 7.'),
('2023-06-01 19:00:00', '+855 22 324 3140', 'Loun Akara', 'Emergency alert: Tsunami warning in Place 8.'),
('2023-06-01 20:30:00', '+855 22 324 3451', 'Saluk Poeu', 'Emergency alert: Tornado warning in Place 9.'),
('2023-06-01 21:00:00', '+855 22 324 2144', 'Khai Sothiya', 'Emergency alert: Chemical spill in Place 10.'),
('2023-06-01 22:30:00', '+855 22 324 3047', 'Uch Anchaly', 'Emergency alert: Gas leak in Place 11.');
