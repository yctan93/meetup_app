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

app.get('/getAllEvents/', function(req, res){
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query("SELECT e.name, COUNT(r.event_id) as 'Registration Count' FROM events e LEFT JOIN registration r ON r.event_id = e.event_id GROUP BY e.name", function (error, results, fields) {
            res.status(200).send(results)
            connection.release();
          
            if (error) throw error;
        });
    });
});

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