var app = require('ampersand-app');
var View = require('ampersand-view');
var template = require('../templates/templates').signup;
var dom = require('ampersand-dom');


module.exports = View.extend({
  pageTitle: 'Sign Up',
  template: template,
  events: {
    'click [data-hook=submit]': 'submit'
  },
  submit: function (e) {
    e.stopPropagation();
    this.model.username = this.queryByHook('username').value;
    this.model.email = this.queryByHook('email').value;
    this.model.password = this.queryByHook('password').value;
    this.model.password2 = this.queryByHook('password2').value;
    var container = this.queryByHook('message-container');
    this.model.signUp({
      username: this.queryByHook('username').value,
      email: this.queryByHook('email').value,
      password: this.queryByHook('password').value,
      password2: this.queryByHook('password2').value
    },{
      success: function (res) {
        console.log(res);
        if (!res.success) {
          if (Object.prototype.toString.call(res.message) == '[object Array]') {
            var errors = '';
            for (var i = 0; i < res.message.length; i++) {
              errors += '<div class="alert alert-danger">' + res.message[i] + '</div>';
            }
            dom.html(container, errors);
          }else {
            dom.html(container, '<div class="alert alert-danger">' + res.message + '</div>');
          }
        }else {
          dom.html(container, '<div class="alert alert-success">' + res.message + '</div>');
          setTimeOut(function () {
            app.navigate('/login');
          }, 3000)
        }
      }
    });
  }
});
