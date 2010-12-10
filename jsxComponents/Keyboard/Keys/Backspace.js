jsx.require(
  ['Dom', 'Events', '{jsxComponents}.Keyboard.Keys.ServiceKey'],
  function() {
    jsxComponents.Keyboard.Keys.Backspace = function(key){
      this.doTimeoutAction = jsxComponents.Keyboard.Keys.doTimeoutAction;
      this.doAction = function(){
        jsx.CallBacks.dispatch('jsxComponents-Keyboard-Press', this.element);
      };
      this.init(key);
    };
    jsxComponents.Keyboard.Keys.Backspace.prototype = jsxComponents.Keyboard.Keys.ServiceKey;
    
    jsx.loaded('{jsxComponents}.Keyboard.Keys.Backspace');
  }
);
