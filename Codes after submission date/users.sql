-- These sql command is uploaded after technical assessment submission date

DROP DATABASE IF EXISTS events_db;

CREATE DATABASE events_db;

USE events_db;

CREATE TABLE users(
	user_id int PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(50) UNIQUE NOT NULL, -- Added unique constraint to prevent duplicate entry
	password VARCHAR(50)NOT NULL
);

CREATE TABLE events(
	event_id int PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(50) UNIQUE NOT NULL, -- Added unique constraint to prevent duplicate entry
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

-- Added unique constraint so that same user cannot register for the same event
ALTER TABLE registration 
	ADD CONSTRAINT unique_registration UNIQUE(user_id, event_id);