jsx.require(
  ['Dom'],
  function() {
    jsxComponents.Keyboard.Keys.Fake = function(key, capitalize){
      this.doAction = jsx.Vars.NULL;
      this.getView = function(){
        return '';
      };
      this.init = function(key){
        jsx.bind(this, jsxComponents.Keyboard.Keys.init, key)();
        jsx.Dom.addClassName(this.element, 'jsxComponents-Keyboard-' + this.getValue());
        jsx.Dom.addClassName(this.element, 'jsxComponents-Keyboard-Fake');
      };
      this.init(key);
    };
    jsxComponents.Keyboard.Keys.Fake.prototype = jsxComponents.Keyboard.Keys;
    
    jsx.loaded('{jsxComponents}.Keyboard.Keys.Fake');
  }
);
