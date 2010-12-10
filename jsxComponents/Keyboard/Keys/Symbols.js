jsx.require(
  ['Dom', 'Events', '{jsxComponents}.Keyboard.Keys.ServiceKey'],
  function() {
    jsxComponents.Keyboard.Keys.Symbols = function(key){
      this.doAction = function(){
        jsx.CallBacks.dispatch('jsxComponents-Keyboard-Press', this.element, 'Symbols');
      };
      this.init(key);
    };
    jsxComponents.Keyboard.Keys.Symbols.prototype = jsxComponents.Keyboard.Keys.ServiceKey;
    
    jsx.loaded('{jsxComponents}.Keyboard.Keys.Symbols');
  }
);

