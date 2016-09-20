var app = require('ampersand-app');
var View = require('ampersand-view');
var template = require('../templates/templates').login;
var dom = require('ampersand-dom');
var Cookies = require('js-cookie');

module.exports = View.extend({
  pageTitle: 'Log In',
  template: template,
  events: {
    'click [data-hook=submit]': 'submit'
  },
  initialize: function () {
    var self = this;
    if (this.model) {
      var token = this.model.getToken();
      if (token) {
        this.model.token = token;
        this.model.fetch({
          success: function (res) {
            self.model.isLoggedIn = true;
            app.trigger('userChange');
            app.navigate('/');
          }
        })
      }
    }
  },
  submit: function () {
    var data = {
      username: this.queryByHook('username').value,
      password: this.queryByHook('password').value
    }
    var container = this.queryByHook('message-container');
    var self = this;
    this.model.getAuth(data, {
      success: function (res) {
        if (res.success) {
          console.log(res);
          self.model.isLoggedIn = true;
          self.model.username = res.username;
          self.model.email = res.email;
          app.trigger('userChange');
          app.navigate('/');
        }
        else {
          if (Object.prototype.toString.call(res.message) == '[object Array]') {
            var errors = '';
            for (var i = 0; i < res.message.length; i++) {
              errors += '<div class="alert alert-danger">' + res.message[i] + '</div>';
            }
            dom.html(container, errors);
          }else {
            dom.html(container, '<div class="alert alert-danger">' + res.message + '</div>');
          }
        }
      },
      error: function (res) {
        if (res.errors) {
          if (Object.prototype.toString.call(res.message) == '[object Array]') {
            var errors = '';
            for (var i = 0; i < res.message.length; i++) {
              errors += '<div class="alert alert-danger">' + res.message[i] + '</div>';
            }
            dom.html(container, errors);
          }else {
            dom.html(container, '<div class="alert alert-danger">' + res.message + '</div>');
          }
        }
      }
    })
  }
});
