/**
 * todo server using express
 *
 *
 * Created by Jerome on 8/19/16.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    PORT = process.env.PORT || 3000,
    todos = [],
    todoNextId = 1,
    app = express();
app.use(bodyParser.json());

// var middleware = require('./middleware.js');
//app.use(middleware.logger);


app.get('/', function (req, res) { //middleware.requireAuthentication
    res.send('Todo API ROOT');
});

// app.use(express.static(__dirname +'/public'));
// GET /todos

app.get('/todos', function (req, res) { //middleware.requireAuthentication
    res.json(todos);
});

//GET /todos:id
app.get('/todos/:id', function (req, res) { //middleware.requireAuthentication
    var todoId = parseInt(req.params.id, 10),
        matchedTodo = _.findWhere(todos, {id: todoId});
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404)
           .send();
    }
});

//POST /todos
app.post('/todos', function (req, res) {
        var body = _.pick(req.body, 'description', 'completed');
        if (!_.isBoolean(body.completed) || !_.isString(body.description || body.description.trim().length === 0)) {
            res.status(400)
               .send();
        }
        body.description = body.description.trim();
        body.id = todoNextId++;
        todos.push(body);
        res.json(body);
    });

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    "use strict";
    var todoId = parseInt(req.params.id, 10),
        matchedTodo = _.findWhere(todos, {id: todoId});
    var x = _.without(todos, matchedTodo);
    console.log(x);
   if (!matchedTodo) {
       res.status(404)
          .json({"error":"no todos found with that id"})
          .send();
    } else {
       todos = _.without(todos, matchedTodo);
       res.json(matchedTodo);
   }
});

app.listen(PORT, function () {
    console.log('Express Server started on PORT: ' + PORT + "!");
});
