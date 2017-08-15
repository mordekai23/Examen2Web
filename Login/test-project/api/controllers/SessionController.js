/**
 * SessionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var bcrypt = require('bcrypt');

module.exports = {

  'new': function(req, res) {
    res.view('session/new');
  },

  create: function(req, res, next) {

    // Check for correo and password in params sent via the form, if none
    // redirect the browser back to the sign-in form.
    if (!req.param('correo') || !req.param('password')) {
      // return next({err: ["Password doesn't match password confirmation."]});

      var usernamePasswordRequiredError = [{
        message: 'Ingrese su Contraseña y correo.'
      }]

      // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
      // the key of usernamePasswordRequiredError
      req.session.flash = {
        err: usernamePasswordRequiredError
      }

      res.redirect('/session/new');
      return;
    }

    // Try to find the user by there correo direccion.
    // findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
    // User.findOneByEmail(req.param('correo')).done(function(err, user) {
    User.findOneByEmail(req.param('correo'), function foundUser(err, user) {
      if (err) return next(err);

      // If no user is found...
      if (!user) {
        var noAccountError = [{
          name: 'noAccount',
          message: 'The correo direccion ' + req.param('correo') + ' not found.'
        }]
        req.session.flash = {
          err: noAccountError
        }
        res.redirect('/session/new');
        return;
      }

      // Compare password from the form params to the encrypted password of the user found.
      bcrypt.compare(req.param('password'), user.password, function(err, valid) {
        if (err) return next(err);

        // If the password from the form doesn't match the password from the database...
        if (!valid) {
          var usernamePasswordMismatchError = [{
            nombre: 'usernamePasswordMismatch',
            message: 'Invalid username and password combination.'
          }]
          req.session.flash = {
            err: usernamePasswordMismatchError
          }
          res.redirect('/session/new');
          return;
        }

        // Log user in
        req.session.authenticated = true;
        req.session.User = user;

          //Redirect to their profile page (e.g. /views/user/show.ejs)
          res.redirect('/user/show/' + user.id);
        });
      });
  },
  destroy: function (req, res, next) {
    req.session.destroy();
    res.redirect('/session/new');

  }
};
