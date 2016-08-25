/**
 * Created by Jerome on 8/25/16.
 */
module.exports = function (sequelize, DataTypes) {
    'use strict';

    return sequelize.define('todo', {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
};
