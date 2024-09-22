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

app.get('/getAllEvents/', function(req, res){
        pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query("select name from events", function (error, results, fields) {
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
            res.status(200).send(results)
            connection.release();
        
            if (error) throw error;
        });
    });
});

app.listen(port, function () {
    console.log("Server running on port " + port);
});
