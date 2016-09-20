var View = require('ampersand-view');
var template = require('../templates/templates').user;

module.exports = View.extend({
  pageTitle: 'User Page',
  template: template,
  render: function () {
    if (this.model.isLoggedIn) {
      this.renderWithTemplate(this, this.template);
    }else {
      app.navigate('/');
    }
  }
})
