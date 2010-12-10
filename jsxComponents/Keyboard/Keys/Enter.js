jsx.require(
  ['Dom', 'Events', 'CallBacks', '{jsxComponents}.Keyboard.Keys.ServiceKey'],
  function() {
    jsxComponents.Keyboard.Keys.Enter = function(key){
      this.down = function(){
        this.events.up.start();
        jsx.CallBacks.dispatch('jsxComponents-Keyboard-Down', this.element);
      };
      this.up = function(){
        this.events.up.stop();
        if (this.pressTimeout){
          window.clearTimeout(this.pressTimeout);
        }
        this.doAction();
        jsx.CallBacks.dispatch('jsxComponents-Keyboard-Up', this.element, this.key);
      };
      this.doAction = function(){
        jsx.CallBacks.dispatch('jsxComponents-Keyboard-Press', this.element, 'Enter');
      };
      this.init(key);
    };
    jsxComponents.Keyboard.Keys.Enter.prototype = jsxComponents.Keyboard.Keys.ServiceKey;
    
    jsx.loaded('{jsxComponents}.Keyboard.Keys.Enter');
  }
);
