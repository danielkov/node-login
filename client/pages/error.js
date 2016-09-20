var View = require('ampersand-view');
var template = require('../templates/templates').error;

module.exports = View.extend({
  pageTitle: '404 Page not found',
  template: template
})
