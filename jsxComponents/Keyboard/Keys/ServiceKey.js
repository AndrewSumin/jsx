jsx.require(
  ['Dom', 'Events'],
  function(){
    jsxComponents.Keyboard.Keys.ServiceKey = (function(){
      var constructor = function(){
        this.doTimeoutAction = jsx.Vars.NULL;
        this.init = function(key, capitalize){
          jsx.bind(this, jsxComponents.Keyboard.Keys.init, key, capitalize)();
          jsx.Dom.addClassName(this.element, 'jsxComponents-Keyboard-Service');
          jsx.Dom.addClassName(this.element, 'jsxComponents-Keyboard-' + key.type);
        };
      };
      constructor.prototype = jsxComponents.Keyboard.Keys;
      return new constructor();
    })();
    jsx.loaded('{jsxComponents}.Keyboard.Keys.ServiceKey');
  }
);