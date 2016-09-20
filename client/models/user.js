var AmpersandModel = require('ampersand-model');
var Cookies = require('js-cookie');


module.exports = AmpersandModel.extend({
    type: 'user',
    url: '/api/user',
    props: {
        token: ['string'],
        username: ['string', true, ''],
        email: ['string'],
        isLoggedIn: ['boolean', true, false]
    },
    ajaxConfig: function () {
      if (this.token) {
        return {
          headers: {
            'X-CSRF-Token': this.token
          }
        }
      }
      return;
    },
    getToken: function () {
      var token;
      if (this.token) {
        token = this.token;
      }else if (Cookies.get('CSRF-Token')) {
        token = Cookies.get('CSRF-Token');
      }else if (localStorage['CSRF-Token']) {
        token = localStorage['CSRF-Token'];
      }else if (document.querySelectorAll('[name=CSRF-Token]')[0]) {
        token = document.querySelectorAll('[name=CSRF-Token]')[0].content;
      }else {
        token = null;
      }
      return token;
    },
    removeToken: function () {
      if (this.token) {
        this.token = null;
      }else if (Cookies.get('CSRF-Token')) {
        Cookies.remove('CSRF-Token');
      }else if (localStorage['CSRF-Token']) {
        localStorage['CSRF-Token'] = null;
      }else if (document.querySelectorAll('[name=CSRF-Token]')[0]) {
        document.querySelectorAll('[name=CSRF-Token]')[0].parentNode.removeChild(document.querySelectorAll('[name=CSRF-Token]')[0]);
      }
      return;
    },
    storeToken: function (token) {
      this.token = token;
      if (navigator.cookieEnabled) {
        Cookies.set('CSRF-Token', token);
      }else if (window.localStorage) {
        localStorage['CSRF-Token'] = token;
      }else {
        var t = document.createElement('meta');
        t.name = 'CSRF-Token';
        t.content = token;
        document.head.appendChild(t);
      }
    },
    getAuth: function (data, o) {
      var self = this;
      if (data.username && data.password) {
        var request = new XMLHttpRequest();
        request.open('POST', '/api/auth', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onload = function() {
          var res = JSON.parse(request.responseText);
          if (request.status >= 200 && request.status < 400) {
            if (o.success && typeof o.success === 'function') {
              if (res.success && res.token) {
                self.storeToken(res.token);
              }
              o.success(res);
            }
          } else {
            if (o.error && typeof o.error === 'function') {
              o.error(res);
            }
          }
        };

        request.onerror = function(err) {
          if (o.error && typeof o.error === 'function') {
            o.error(err);
          }
        };
        request.send(JSON.stringify(data));
      }
    },
    signUp: function (data, o) {
      var self = this;
      if (data.username && data.email && data.password && data.password2) {
        var request = new XMLHttpRequest();
        request.open('POST', '/api/user', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onload = function() {
          var res = JSON.parse(request.responseText);
          if (request.status >= 200 && request.status < 400) {
            if (o.success && typeof o.success === 'function') {
              if (res.success && res.token) {
                self.storeToken(res.token);
              }
              o.success(res);
            }
          } else {
            if (o.error && typeof o.error === 'function') {
              o.error(res);
            }
          }
        };

        request.onerror = function(err) {
          if (o.error && typeof o.error === 'function') {
            o.error(err);
          }
        };
        request.send(JSON.stringify(data));
      }
    },
    logout: function () {
      this.isLoggedIn = false;
      this.username = '';
      this.email = '';
      this.token = null;
      this.removeToken();
    }
});
