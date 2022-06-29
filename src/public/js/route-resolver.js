'use strict';

class RouteResolver {
  constructor(router) {
    this.router = router;
    this.overrideStateHandlers();
    this.setupListeners();
  }

  overrideStateHandlers() {
    /// Begin code from https://stackoverflow.com/a/25673911/1270786
    var _wr = function(type) {
      var orig = history[type];
      return function() {
          var rv = orig.apply(this, arguments);
          var e = new Event(type);
          e.arguments = arguments;
          window.dispatchEvent(e);
          return rv;
      };
    };
    history.pushState = _wr('pushState'), history.replaceState = _wr('replaceState');
    /// End code from https://stackoverflow.com/a/25673911/1270786
  }

  setupListeners() {
    // listen for popstate change
    window.addEventListener('popstate', (e) => {
      console.log('pop', e);
      const newLocation = window.location.pathname;
      this.resolveRoute(newLocation);
    });

    // listen for pushstate change
    window.addEventListener('pushState', (e) => {
      console.log('pushState called', e);
      if(e?.arguments?.length === 3) {
        // const newState = e.arguments[0]; // unused for now
        const newLocation = e.arguments[2];
        this.resolveRoute(newLocation);
      }
    });

    window.addEventListener('replaceState', function(e) {
      console.warn('replaceState called', e);
    });

    window.addEventListener('load', () => {
      const newLocation = window.location.pathname;
      this.resolveRoute(newLocation);
    });
  }

  resolveRoute(newLocation) {
    this.router
    .resolve({ pathname: newLocation })
    .then(result => {
      const mainElem = document.getElementById('main');
      // test for typeof string or Element?
      if(typeof result === 'string') {
        mainElem.innerHTML = result;
      } else if(typeof result === 'function'){
        mainElem.innerHTML = '';
        mainElem.appendChild(result)
      }
    });
  }
}

export default RouteResolver;