/**
 * Created by Jerome on 8/25/16.
 */
var Sequelize = require('sequelize'),
    env = process.env.NODE_ENV || 'development',
    sequelize;
if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        'dialect': 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + "/data/dev-todo-api.sqlite"
    });
}

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
