jsxComponents.Keyboard.Keys = {
  init: function(key, capitalize){
    this.element = document.createElement('a');
    this.element.href = 'javascript:void(0)';
    this.key = key;
    jsx.Dom.addClassName(this.element, 'jsxComponents-Keyboard-Key');
    this.refresh(capitalize || false);
    
    this.events = {};
    this.events.down = jsx.Events.observe(this.element, 'mousedown', jsx.bind(this, this.down));
    this.events.up = jsx.Events.observe(document, 'mouseup', jsx.bind(this, this.up));
    this.events.out = jsx.Events.observe(this.element, 'mouseout', jsx.bind(this, this.out));
    this.events.up.stop();
  },
  refresh: function(capitalize){
    this.capitalize = capitalize;
    this.element.innerHTML = this.getView();
  },
  down: function(){
    this.events.up.start();
    this.doAction();
    this.pressTimeout = window.setTimeout(jsx.bind(this, this.doTimeoutAction), 500);
    jsx.CallBacks.dispatch('jsxComponents-Keyboard-Down', this.element);
  },
  up: function(){
    this.events.up.stop();
    if (this.pressTimeout){
      window.clearTimeout(this.pressTimeout);
    }
    jsx.CallBacks.dispatch('jsxComponents-Keyboard-Up', this.element, this.key);
  },
  out: function(){
    if (this.pressTimeout){
      window.clearTimeout(this.pressTimeout);
    }
  },
  doTimeoutAction: function(){
    this.doAction();
    this.pressTimeout = window.setTimeout(jsx.bind(this, this.doTimeoutAction), 50);
  },
  doAction: function(){
    jsx.CallBacks.dispatch('jsxComponents-Keyboard-Press', this.element, this.getValue());
  },
  getView: function(){
    return this.key.view 
      ? this.capitalize ? this.key.view[1] || this.key.view[0] : this.key.view[0]
      : this.capitalize ? this.key.value[1] || this.key.value[0] : this.key.value[0] || '';
  },
  getValue: function(){
    return this.capitalize ? this.key.value[1] || this.key.value[0] : this.key.value[0] || '';
  }
};
jsx.require(
  [ 
    '{jsxComponents}.Keyboard.Keys.Type',
    '{jsxComponents}.Keyboard.Keys.Space',
    '{jsxComponents}.Keyboard.Keys.Backspace',
    '{jsxComponents}.Keyboard.Keys.Caps',
    '{jsxComponents}.Keyboard.Keys.Enter',
    '{jsxComponents}.Keyboard.Keys.Lang',
    '{jsxComponents}.Keyboard.Keys.Symbols',
    '{jsxComponents}.Keyboard.Keys.Numbers',
    '{jsxComponents}.Keyboard.Keys.Month',
    '{jsxComponents}.Keyboard.Keys.Fake'
  ],
  jsx.bind(jsx, jsx.loaded, '{jsxComponents}.Keyboard.Keys')
);
