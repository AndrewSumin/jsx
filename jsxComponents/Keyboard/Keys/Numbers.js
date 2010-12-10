jsx.require(
  ['Dom', 'Events', '{jsxComponents}.Keyboard.Keys.ServiceKey'],
  function() {
    jsxComponents.Keyboard.Keys.Numbers = function(key){
      this.doAction = function(){
        jsx.CallBacks.dispatch('jsxComponents-Keyboard-Press', this.element, 'Numbers');
      };
      this.init(key);
    };
    jsxComponents.Keyboard.Keys.Numbers.prototype = jsxComponents.Keyboard.Keys.ServiceKey;
    
    jsx.loaded('{jsxComponents}.Keyboard.Keys.Numbers');
  }
);

