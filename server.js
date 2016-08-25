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
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({
        where: {
            id: todoId
        }
    })
      .then(function (rowsDeleted) {
          if (rowsDeleted === 0) {
              res.status(404)
                 .json({
                     error: 'No todo with id'
                 });
          } else {
              res.status(204)
                 .send();
          }
      }, function () {
          res.status(500)
             .send();
      });
});

//PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    "use strict";

    var todoId = parseInt(req.params.id, 10),
        body = _.pick(req.body, 'description', 'completed'),
        attr = {};

    if (body.hasOwnProperty('completed')) {
        attr.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attr.description = body.description;
    }
    db.todo.findById(todoId)
      .then(function (todo) {
          if (todo) {
              todo.update(attr).then(function (todo) {
                  res.json(todo.toJSON());
              }, function (e) {
                  res.status(400)
                     .json(e);
              });
          } else {
              res.status(404)
                 .send();
          }
      }, function () {
          res.status(500)
             .send();
      });
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




