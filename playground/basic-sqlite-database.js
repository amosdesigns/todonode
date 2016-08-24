/**
 * Created by Jerome on 8/24/16.
 */
var Sequelize = require('sequelize')
sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + "/basic-sqlite-database.sqlite"
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync({
    // force: true
})
         .then(function () {
             console.log('Everything is synced');


             

         //     Todo.create({
         //         description: 'Cook dinner'
         //     })
         //         .then(function (todo) {
         //             return Todo.create({
         //                 description: 'Cook lunch'
         //             });
         //
         //         })
         //         .then(function () {
         //             // return Todo.findyById(1);
         //             return Todo.findAll({
         //                 where: {
         //                     completed: false
         //                 }
         //             });
         //         })
         //         .then(function (todos) {
         //             if (todos) {
         //                 todos.forEach(function (todo) {
         //                     console.log(todo.toJSON());
         //                 })
         //
         //             } else {
         //                 console.log('no todo found!');
         //             }
         //         })
         //         .catch(function (e) {
         //             console.log(e);
         //         });
});
