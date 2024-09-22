DROP DATABASE IF EXISTS events_db;

CREATE DATABASE events_db;

USE events_db;

CREATE TABLE users(
	user_id int PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(50)NOT NULL
);

CREATE TABLE events(
	event_id int PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(50) NOT NULL,
	user_id int NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE media(
	media_id int PRIMARY KEY AUTO_INCREMENT,
	media_data BLOB,
	event_id int NOT NULL,
	FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE registration(
	registration_id int PRIMARY KEY AUTO_INCREMENT,
	user_id int NOT NULL,
	event_id int NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- INSERT INTO users (email, password) VALUES ( 'user1@email.com', 'password');
-- INSERT INTO users (email, password) VALUES ( 'user2@email.com', 'password');
-- INSERT INTO events (name, user_id) VALUES ('event1', 1);
-- INSERT INTO events (name, user_id) VALUES ('event2', 2);
-- INSERT INTO registration (user_id, event_id) VALUES (1, 2);
-- INSERT INTO registration (user_id, event_id) VALUES (2, 1);

-- SELECT users.email, events.name
-- FROM registration
-- LEFT JOIN users ON registration.user_id = users.user_id
-- LEFT JOIN events ON registration.event_id = events.event_id;