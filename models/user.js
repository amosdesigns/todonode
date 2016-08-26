/**
 * Created by Jerome on 8/25/16.
 */
module.exports = function (sequelize, DataTypes) {
    'use strict';

    return sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 100]
            }
        }
    });
}
