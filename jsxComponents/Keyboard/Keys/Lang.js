jsx.require(
  ['Dom', 'Events', 'CallBacks', '{jsxComponents}.Keyboard.Keys.ServiceKey'],
  function() {
    jsxComponents.Keyboard.Keys.Lang = function(key){
      this.doAction = function(){
        jsx.CallBacks.dispatch('jsxComponents-Keyboard-Press', this.element, this.key.value);
      };
      this.init(key);
    };
    jsxComponents.Keyboard.Keys.Lang.prototype = jsxComponents.Keyboard.Keys.ServiceKey;
    
    jsx.loaded('{jsxComponents}.Keyboard.Keys.Lang');
  }
);

