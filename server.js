/**
 * todo server using express
 *
 *
 * Created by Jerome on 8/19/16.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    PORT = process.env.PORT || 3000,
    todos = [],
    todoNextId = 1,
    app = express();
app.use(bodyParser.json());

// var middleware = require('./middleware.js');
//app.use(middleware.logger);


app.get('/',  function (req, res) { //middleware.requireAuthentication
    res.send('Todo API ROOT');
});

// app.use(express.static(__dirname +'/public'));
// GET /todos

app.get('/todos',  function (req, res) { //middleware.requireAuthentication
    res.json(todos);
});

//GET /todos:id
app.get('/todos/:id',  function (req, res) { //middleware.requireAuthentication
    var todoId = parseInt(req.params.id, 10),
        matchedTodo;
    todos.forEach(function (todo) {
        if(todoId === todo.id){
            matchedTodo = todo;
        }
    });
    if(matchedTodo){
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

//POST /todos
app.post('/todos', function (req, res) {
    var body = req.body;
        body.id = todoNextId++;
    todos.push(body);
    res.json(body);
    }
);

app.listen(PORT, function () {
    console.log('Express Server started on PORT: '+PORT+"!");
});
