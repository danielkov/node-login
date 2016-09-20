var app = require('ampersand-app');
var User = require('./models/user');
var Router = require('./router');
var MainView = require('./pages/main');

require('./styles/main.sass')

window.app = app;

app.extend({
  user: new User(),
  router: new Router(),
  init: function () {
    this.mainView = new MainView({
            model: this.user,
            el: document.body
        });
    this.router.history.start();
  },
  navigate: function (page) {
    var url = (page.charAt(0) === '/') ? page.slice(1) : page;
        this.router.history.navigate(url, {
            trigger: true
        });
  }
})

app.init();
