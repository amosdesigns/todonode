/**
 * todo server using express
 *
 *
 * Created by Jerome on 8/19/16.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    db = require('./db.js'),
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
    var query = req.query,
        where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    // search filter - "go to work on saturday"
    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({where: where})
      .then(function (todos) {
          res.json(todos);
      }, function (e) {
          res.status(500)
             .send();
      });
});

//GET /todos:id
app.get('/todos/:id', function (req, res) { //middleware.requireAuthentication
    "use strict";
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId)
      .then(function (todo) {
          if (!!todo) {
              res.json(todo.toJSON());
          } else {
              res.status(404)
                 .send();
          }
      }, function (e) {
          res.status(500)
             .send();
      });
});

//POST /todos
app.post('/todos', function (req, res) {
    "use strict";
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body)
      .then(function (todo) {
          res.json(todo.toJSON());
      }, function (e) {
          res.status(400)
             .json(e);
      });
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

// sync
db.sequelize.sync()
  .then(function () {

      //Running the server
      app.listen(PORT, function () {
          "use strict";
          console.log('Express Server started on PORT: ' + PORT + "!");
      });
  });




