var View = require('ampersand-view');
var app = require('ampersand-app');
var template = require('../templates/templates').remove;

module.exports = View.extend({
  pageTitle: 'Remove User?',
  template: template,
  events: {
    'click [data-hook~=remove-user]': 'removeUser'
  },
  render: function () {
    this.renderWithTemplate(this, this.template);
  },
  removeUser: function () {
    app.user.destroy({
      success: function (data) {
        if (data.success) {
          document.getElementsByAttribute('data-hook', 'remove-message')[0].innerHTML = '<div class="alert alert-success">' + data.message + '</div>';
        }else {
          document.getElementsByAttribute('data-hook', 'remove-message')[0].innerHTML = '<div class="alert alert-error">Something went wrong, while removing account.</div>';
        }
      }
    })
  }
})
