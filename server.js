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
    bcrypt = require('bcrypt'),
    middleware = require('./middleware')(db),
    PORT = process.env.PORT || 3000,
    todos = [],
    app = express();

app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.send('Todo API ROOT');
});

// GET /todos?completed=true&q=work
app.get('/todos', middleware.requireAuthentication, function (req, res) {
    "use strict";
    var query = req.query,
        where = {
            userId: req.user.get('id')
        };

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

    db.todo.findAll({
        where: where
    })
      .then(function (todos) {
          res.json(todos);
      }, function (e) {
          res.status(500)
             .send();
      });
});

//GET /todos:id
app.get('/todos/:id', middleware.requireAuthentication, function (req, res) {
    "use strict";
    var todoId = parseInt(req.params.id, 10);

    db.todo.findOne({
        where: {
            id: todoId,
            userId: req.user.get('id')
        }
    })
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
app.post('/todos', middleware.requireAuthentication, function (req, res) {
    "use strict";
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body)
      .then(function (todo) {
          req.user.addTodo(todo)
             .then(function () {
                 return todo.reload();
             })
             .then(function (todo) {
                 res.json(todo.toJSON());
             });
      }, function (e) {
          res.status(400)
             .json(e);
      });
});

// DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function (req, res) {
    "use strict";
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({
        where: {
            id: todoId,
            userId: req.user.get('id')
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

// PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function (req, res) {
    "use strict";

    var todoId = parseInt(req.params.id, 10),
        body = _.pick(req.body, 'description', 'completed'),
        attrib = {};

    if (body.hasOwnProperty('completed')) {
        attrib.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attrib.description = body.description;
    }

    db.todo.findOne({
        where: {
            id: todoId,
            userId: req.user.get('id')
        }
    })
      .then(function (todo) {
          if (todo) {
              todo.update(attrib)
                  .then(function (todo) {
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

/**
 *
 *
 *
 * user login request tasks
 *
 *
 *
 */

// users post request
app.post('/users', function (req, res) {
    "use strict";
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body)
      .then(function (user) {
          res.json(user.toPublicJSON());
      }, function (e) {
          res.status(400)
             .json(e);
      });
});

// users /users/login  post request
app.post('/users/login', function (req, res) {
    "use strict";
    var body = _.pick(req.body, 'email', 'password'),
        userInstance = user;

    db.user.authenticate(body)
      .then(function (user) {
          var token = user.generateToken('authentication');
          return db.token.create({
              token: token
          });
      })
      .then(function (tokenInstance) {
          res.header('Auth', tokenInstance.get('token'))
             .json(userInstance.toPublicJSON());
      })
      .catch(function () {
          res.status(401)
             .send();
      });
});

// DELETE /users/login
app.delete('/users/login', middleware.requireAuthentication, function (req, res) {
    "use strict";

    req.token.destroy()
       .then(function () {
           res.status(204)
              .send();
       })
       .catch(function () {
           res.status(500)
              .send();
       });
});

// sync
db.sequelize.sync({force: true})
  .then(function () {

      //Running the server
      app.listen(PORT, function () {
          "use strict";
          console.log('***********************************************************');
          console.log('***********************************************************');
          console.log('******** NEW Express Server started on PORT: ' + PORT + "! ********");
          console.log('***********************************************************');
          console.log('***********************************************************');
      });
  });
