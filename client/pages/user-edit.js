var app = require('ampersand-app');
var View = require('ampersand-view');
var template = require('../templates/templates').signup;
var Form = require('../forms/signup');
var dom = require('ampersand-dom');


module.exports = View.extend({
  pageTitle: 'Sign Up',
  template: template,
  subviews: {
    form: {
      container: 'form',
      waitFor: 'model',
      prepareView: function (el) {
        var model = this.model;
        return new Form({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            app.user.save(data, {
              wait: true,
              success: function (res) {
                var container = document.getElementsByAttribute('data-hook', 'message-container')[0];
                if (!res.success) {
                  if (Object.prototype.toString.call(res.message) == '[object Array]') {
                    var errors = '';
                    for (var i = 0; i < res.message.length; i++) {
                      errors += '<div class="alert alert-danger">' + res.message[i] + '</div>';
                    }
                    dom.html(container, errors);
                  }else {
                    dom.html(container, '<div class="alert alert-danger">' + message + '</div>');
                  }
                }else {
                  dom.html(container, '<div class="alert alert-success">' + message + '</div>');
                }
              }
            });
          }
        });
      }
    }
  }
});
