/**
 * todo server using express
 *
 *
 * Created by Jerome on 8/19/16.
 */
var express = require('express'),
    PORT = process.env.PORT || 3000,
    app = express();

// var middleware = require('./middleware.js');
//app.use(middleware.logger);


app.get('/',  function (req, res) { //middleware.requireAuthentication
    res.send('Todo API ROOT');
});

// app.use(express.static(__dirname +'/public'));

app.listen(PORT, function () {
    console.log('Express Server started on PORT: '+PORT+"!");
});
