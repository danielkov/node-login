var Router = require('ampersand-router');
var Main = require('./pages/main');
var App = require('ampersand-app');
var HomePage = require('./pages/home');
var ErrorPage = require('./pages/error');
var LoginPage = require('./pages/login');
var SignupPage = require('./pages/signup');
var UserPage = require('./pages/user');
var UserEditPage = require('./pages/user-edit');
var UserRemovePage = require('./pages/user-remove');

module.exports = Router.extend({
  renderPage: function () {
    App.main = new Main({
      model: app.user
    });
    App.main.render();
  },
  routes: {
    '': 'index',
    'login': 'login',
    'logout': 'logout',
    'signup': 'signup',
    'remove': 'remove',
    'user': 'user',
    'edit': 'edit',
    '*catchAll': 'catchAll'
  },
  index: function () {
    app.trigger('page', new HomePage({
      model: app.user,
    }))
  },
  catchAll: function () {
    app.trigger('page', new ErrorPage({
      model: app.user,
    }))
  },
  login: function () {
    app.trigger('page', new LoginPage({
      model: app.user
    }))
  },
  logout: function () {
    app.navigate('/');
    app.user.logout();
    app.trigger('userChange');
  },
  signup: function () {
    app.trigger('page', new SignupPage({
      model: app.user
    }));
  },
  user: function () {
    app.trigger('page', new UserPage({
      model: app.user
    }))
  },
  edit: function () {
    app.trigger('page', new UserEditPage({
      model: app.user
    }))
  },
  remove: function () {
    app.trigger('page', new UserRemovePage({
      model: app.user
    }))
  }
})
