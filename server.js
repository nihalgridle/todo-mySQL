//=====set up========
var express = require('express');
var app = express();
//var mysql = require('mysql');
//var mongoose = require('mongoose');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var port = 3000; 

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('/home/nihal/todo-mySQL/public'));

// var connection = mysql.connection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'todoDB'
// });

// Database connection
sequelize = new Sequelize( 'todoDB', 'root', 'root', {
    // dialect: 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql', DEFAULT is mysql
    // host: 'localhost', DEFAULT
    //    pool: {
    //   max: 5, DEFAULT
    //   min: 0, DEFAULT
    //   idle: 10000 DEFAULT
    // }
    // port: 3306
});


// connection.connect(function (err){
//     if (!err) {
//         console.log('Connected to todoDB');
//     }
// });

//mongoose.connect('mongodb://localhost/todoDB');


//Todo-Checklist model

//==== Syntax for defining a model in mongoose ====
//mongoose.model('MyModel', mySchema);
// mySchema is <a Schema>

    var Todo = sequelize.define('Todo', {

        name: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        isChecked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
    sequelize.sync().then( function( err ) {
        if ( !err ) {
            console.log( 'The instance has not been saved:', err );
        } else {
            console.log( 'We have a persisted instance now' );
        }
    });
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });
    

//routes 
    //api
    //get all todos
    app.get('/api/todos', function(req, res) {

        //use findALl() to get all todos in the database
        Todo.findAll().then(function(todos) {
            res.json(todos);
        }, function(err){
            res.send(err);
        });
    });

    //create, update, changeCheckedStatus of todo and send back all todos after creation and updation
    app.post('/api/todos', function(req, res) {
        //console.log(req.body);
        //update name of todo
        if (!req.body.name && req.body.newName && req.body.id) {
            Todo.update({name : req.body.newName}, {where: {id : req.body.id}}).then(function(todos) {
                //get and return all the todos after updating a todo
                Todo.findAll().then(function(todos) {
                    res.json(todos);
                }, function(err){
                    res.send(err);
                });
            }, function(err){
                res.send(err);
            });
        }
        else if (!req.body.name && req.body.id) {
            Todo.update({isChecked : req.body.isChecked}, {where: {id : req.body.id}}).then(function(todos) {
                
            }, function(err){
                res.send(err);
            });
        }
        else if (req.body.name) {
            Todo.create({name : req.body.name, isChecked : false }).then(function(todo) {
                
                //get and return all the todos after creating a todo
                //use findALl() to get all todos in the database
                Todo.findAll().then(function(todos) {
                    res.json(todos);
                }, function(err){
                    res.send(err);
                });
            }, function(err){
                res.send(err);
            });
        }
    });

    //delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {

        if (!req.params.todo_id) {
            return res.send('Todo must have a valid ID!');
        }

        Todo.destroy({
            where: {id : req.params.todo_id}
        }).then(function(todo) {
            //get and return all the todos after deleting todo
            Todo.findAll().then(function(todos) {
                res.json(todos);
            }, function(err){
                res.send(err);
            });
        }, function(err){
            res.send(err);
        });    
    });

app.listen(port, function() {
    console.log( 'App started - listening on port 3000' );
});

    // load the single view file
    app.get('*', function (req, res) {
        res.sendFile('/home/nihal/todo-mySQL/public/index.html'); 
    });