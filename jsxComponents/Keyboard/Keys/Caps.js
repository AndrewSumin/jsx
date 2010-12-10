jsx.require(
  ['Dom', 'Events', '{jsxComponents}.Keyboard.Keys.ServiceKey'],
  function() {
    jsxComponents.Keyboard.Keys.Caps = function(key, capitalize){
      this.capitalizeStatus = capitalize || false;
      this.doAction = function(){
        this.capitalizeStatus = !this.capitalizeStatus;
        jsx.CallBacks.dispatch('jsxComponents-Keyboard-Press', this.element, this.capitalizeStatus);
      };
      this.init(key, capitalize);
    };
    jsxComponents.Keyboard.Keys.Caps.prototype = jsxComponents.Keyboard.Keys.ServiceKey;
    
    jsx.loaded('{jsxComponents}.Keyboard.Keys.Caps');
  }
);
