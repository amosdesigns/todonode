/**
 * todo server using express
 *
 *
 * Created by Jerome on 8/19/16.
 */
var express = require('express'),
    PORT = process.env.PORT || 3000,
    todos = [{
        id: 1,
        description: 'meet mom for lunch',
        completed: false
    }, {
        id: 2,
        description: 'do node course for the next 2 weeks',
        completed: false
    }, {
        id: 3,
        description: 'go to the apple store for a new computer',
        completed: true
    }],
    app = express();

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
        res.send('asking for todo with ID of: ' + todoId);
        res.json(todos);
    } else {
        res.status(404).send();
    }
});

app.listen(PORT, function () {
    console.log('Express Server started on PORT: '+PORT+"!");
});
