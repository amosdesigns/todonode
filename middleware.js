/**
 * Created by Jerome on 8/29/16.
 */
module.exports = function (db) {
    return {
        requireAuthentication: function (req, res, next) {
            var token = req.get('Auth');

            db.user.findByTokentoken(token)
              .then(function (user) {
                      req.user = user;
                      next();
                  },
                  function () {
                      res.status(401)
                         .send();
                  });
        }
    };
};
