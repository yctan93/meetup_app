// These code is update after technical assessment submission date
import express from "express";
import mysql from "mysql2";

const app = express(),
      port = 8080,
      pool = mysql.createPool({
        connectionLimit : 10,
        host            : 'localhost',
        user            : 'testuser',
        password        : 'password',
        database        : 'events_db'
      });

app.use(express.json());

app.get('/', function(req, res){
    res.send("Meetup");
});

// User Management: 1. Signup with Email and Password
app.post('/createNewUser/', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query("INSERT INTO users (email, password) VALUES ('" + email + "', '" + password + "');", function (error, results, fields) {
            if (error) {
                res.status(403).json(error);
            } else {
                res.status(200).send(results)
            }
            connection.release();
        });
    });
});

// User Management: 2. Login with Email and Password
// Status: Not started

// Event Management: 1. Users who want to host can create Events (an Event can contain rich media content, e.g images, files)
// Status: To implement functionality to include rich media content, e.g images, files next
app.post('/createEvent/', function(req, res){
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        var eventName = req.body.event_name;
        var userId = req.body.user_id;

        connection.query("INSERT INTO events (name, user_id) VALUES ('" + eventName + "', " + userId + ");", function (error, results, fields) {
            if (error) {
                res.status(403).json(error);
            } else {
                res.status(200).send(results)
            }
            connection.release();
        });
    });
});

// Event Management: 2. Users who have created an Event can edit/delete their Event
// Status: Not started

// Event Management: 3. Users who have created an Event can see who and how many people have registered for their Event
// Status: To implement functionality to include list of users registered for the event
app.post('/getEventDetails/', function(req, res){
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        var userId = req.body.user_id;
        
        /*
            SQL command example: 
            SELECT e.name, COUNT(r.event_id) AS 'Registration Count', e.user_id, u.email FROM events e 
            LEFT JOIN registration r ON r.event_id = e.event_id 
            LEFT JOIN users u ON u.user_id = e.user_id 
            GROUP BY e.name HAVING e.user_id = 1;

            SQL command output:
            +--------+--------------------+---------+-----------------+
            | name   | Registration Count | user_id | email           |
            +--------+--------------------+---------+-----------------+
            | event1 |                  2 |       1 | user1@email.com |
            | event2 |                  1 |       1 | user1@email.com |
            +--------+--------------------+---------+-----------------+
        */

        connection.query("SELECT e.name, COUNT(r.event_id) AS 'Registration Count', e.user_id, u.email FROM events e LEFT JOIN registration r ON r.event_id = e.event_id LEFT JOIN users u ON u.user_id = e.user_id GROUP BY e.name HAVING e.user_id = " + userId + ";", function (error, results, fields) {
            res.status(200).send(results)
            connection.release();
          
            if (error) throw error;
        });
    });
});

// Event Management: 4. Users who want to attend an Event can see the list of all events and their details
// Status: 
//   1. To include LEFT JOIN on command after functionality to include rich media content, e.g images, files next has been implemented
//   2. Implemented API for user to register for event
app.get('/getAllEvents/', function(req, res){
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query("SELECT * from events", function (error, results, fields) {
            res.status(200).send(results)
            connection.release();
          
            if (error) throw error;
        });
    });
});

app.post('/registerEvent/', function(req, res){
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        var eventId = req.body.event_id;
        var userId = req.body.user_id;

        connection.query("INSERT INTO registration (user_id, event_id) VALUES (" + userId + "," + eventId + ");", function (error, results, fields) {
            if (error) {
                res.status(403).json(error);
            } else {
                res.status(200).send(results)
            }
            connection.release();
        });
    });
});

app.listen(port, function () {
    console.log("Server running on port " + port);
});