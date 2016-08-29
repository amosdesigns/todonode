/**
 * Created by Jerome on 8/25/16.
 */
var bcrypt = require('bcrypt'),
    _ = require('underscore'),
    cryptojs = require('crypto-js'),
    jwt = require('jsonwebtoken');



module.exports = function (sequelize, DataTypes) {
    'use strict';

    var user =  sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [8, 100]
            },
            set: function (value){
               var salt = bcrypt.genSaltSync(10),
                   hashedPassword = bcrypt.hashSync(value, salt);
                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }

    }, {
        hooks: {
            beforeValidate: function (user, options) {

                //user.email
                if (typeof user.email === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        },
        classMethods:{
           authenticate: function (body) {
               return new Promise (function (resolve, reject) {
                   if (typeof body.email !== 'string' || typeof body.password !== 'string'){
                       // if bad res return 400
                       return reject();
                   }

                   // findon()
                   user.findOne({
                       where: {
                           email: body.email
                       }
                   }).then(function(user) {
                       if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
                           return reject();
                       }

                       resolve(user);
                   }, function (e) {
                       return reject();
                   });
               });
           }
        },
        instanceMethods: {
            toPublicJSON: function() {
                var json = this.toJSON();
                return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
            },
            generateToken: function (type) {
                if (!_.isString(type)) {
                    return undefined;
                }

                try {
                    var stringData = JSON.stringify({id: this.get('id'), type: type});
                    var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
                    var token = jwt.sign({
                        token: encryptedData
                    }, 'qwerty098');

                    return token;
                } catch (e) {
                    console.error(e);
                    return undefined;
                }
            }
        }
    });
    return user;
};