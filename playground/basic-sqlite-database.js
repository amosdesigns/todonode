var Sequelize = require('sequelize'),
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/basic-sqlite-database.sqlite'
    }),
    Todo = sequelize.define('todo', {
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
    }),
    User = sequelize.define('user', {
        email: Sequelize.STRING
    });

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
    //force: true
})
         .then(function () {
             "use strict";
             console.log('Everything is synced');

             User.findById(1)
                 .then(function (user) {
                     "use strict";
                     user.getTodos({
                         where: {
                             completed: true
                         }
                     })
                         .then(function (todos) {
                             "use strict";
                             todos.forEach(function (todo) {
                                 console.log(todo.toJSON());
                             });
                         });
                 });

             // User.create({
             // 	email: 'mail@happyone.com'
             // }).then(function () {
             // 	return Todo.create({
             // 		description: 'Clean yard and home'
             // 	});
             // }).then(function (todo) {
             // 	User.findById(1).then(function (user) {
             // 		user.addTodo(todo);
             // 	});
             // });
         });
