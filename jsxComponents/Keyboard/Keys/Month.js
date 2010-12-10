jsxComponents.Keyboard.Keys.Month = function(key){
  this.doAction = function(){
    jsx.CallBacks.dispatch('jsxComponents-Keyboard-Press', this.element, this.getValue());
  };
  this.init = function(key){
    jsx.bind(this, jsxComponents.Keyboard.Keys.init, key)();
    jsx.Dom.addClassName(this.element, 'jsxComponents-Keyboard-' + this.key.type);
  };
  this.init(key);
};
jsxComponents.Keyboard.Keys.Month.prototype = jsxComponents.Keyboard.Keys;
jsx.require(['Dom', 'Events'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.Keyboard.Keys.Month'));
