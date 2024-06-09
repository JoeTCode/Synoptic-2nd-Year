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
