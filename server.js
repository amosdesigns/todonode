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


// GET /todos?completed=true&q=work
app.get('/todos', function (req, res) { //middleware.requireAuthentication
    "use strict";
    var queryParams = req.query,
        filteredTodos = todos;

    // if has porperty && completed === 'true'

    // filterTodos = _. where()
    // else if has prop && completed if 'false'

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }
    // search filter - "go to work on saturday"
    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function (todo) {
            "use strict";
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }
    res.json(filteredTodos);
});

//GET /todos:id
app.get('/todos/:id', function (req, res) { //middleware.requireAuthentication
    "use strict";
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
    "use strict";
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

    if (!matchedTodo) {
        res.status(404)
           .json({"error": "no todos found with that id"})
           .send();
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
});

//PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    "use strict";

    var todoId = parseInt(req.params.id, 10),
        matchedTodo = _.findWhere(todos, {id: todoId}),
        body = _.pick(req.body, 'description', 'completed'),
        validAttr = {};

    if (!matchedTodo) {
        return res.status(404)
                  .json({"error": "no todos found with that id"})
                  .send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttr.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        //bad
        return res.status(400)
                  .send();
    }
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttr.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        //bad
        return res.status(400)
                  .send();
    }

    matchedTodo = _.extend(matchedTodo, validAttr);
    res.json(matchedTodo);
});

//Running the server
app.listen(PORT, function () {
    "use strict";
    console.log('Express Server started on PORT: ' + PORT + "!");
});
