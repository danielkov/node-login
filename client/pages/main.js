var View = require('ampersand-view');
var template = require('../templates/templates').body;
var head = require('../templates/templates').head;
var nav = require('../templates/templates').nav;
var ViewSwitcher = require('ampersand-view-switcher');
var _ = require('lodash');
var dom = require('ampersand-dom');
var app = require('ampersand-app');
var domify = require('domify');
var localLinks = require('local-links');

module.exports = View.extend({
  pageTitle: 'Login App',
  template: template,
  autoRender: true,
  initialize: function () {
    this.listenTo(app, 'page', this.handleNewPage);
    this.listenTo(app, 'userChange', this.updateNav);
  },
  events: {
    'click a[href]': 'handleLinkClick'
  },
  render: function () {
    document.head.appendChild(domify(head()));

    this.renderWithTemplate(this, this.template);

    this.queryByHook('nav').appendChild(domify(nav(this)));

    this.pageSwitcher = new ViewSwitcher(this.queryByHook('page-container'), {
      show: function (newView, oldView) {
        document.title = _.result(newView, 'pageTitle') || 'Login App';
        document.scrollTop = 0;

        dom.addClass(newView.el, 'active');

        app.currentPage = newView;
      }
    });
    return this;
  },
  handleNewPage: function (view) {
    this.pageSwitcher.set(view);
  },
  handleLinkClick: function (e) {
    e.stopImmediatePropagation();
    var localPath = localLinks.pathname(e);
    console.log(localPath);
    if (localPath) {
      e.preventDefault();
      app.navigate(localPath);
    }
    return false;
  },
  updateNav: function () {
    var navBar = this.queryByHook('nav');
    navBar.innerHTML = '';
    navBar.appendChild(domify(nav(this)));
  }
});
