jsx.require(['{jsxComponents}.Keyboard.Only'], function(){
  jsx.Components.buildComponent('{jsxComponents}.Keyboard.Input',
    function(){
      this.init = function(element, params){
        this.element = element;
        this.board = params ? params.board : null;
        this.input = jsx.Dom.$$(this.element, '.jsxComponents-Keyboard-Input');
        this.selection = new jsx.SelectionInput(this.input);
        this.keyboard = jsxComponents.Keyboard.Only;
        this.id = jsx.Utils.generateId();
        this.capitalize = params.capitalize || false;
        jsx.Events.observe(this.input, 'focus', jsx.bind(this, this.openKeyboard));
        if (this.input.active){
          this.openKeyboard();
        }
        
        jsx.CallBacks.add('jsxComponents-Keyboard-Type' + this.id, jsx.bind(this, this.type), this.keyboard.element);
        jsx.CallBacks.add('jsxComponents-Keyboard-Delete' + this.id, jsx.bind(this, this.doDelete), this.keyboard.element);
        jsx.CallBacks.add('jsxComponents-Keyboard-Enter' + this.id, jsx.bind(this, this.doEnter), this.keyboard.element);
        jsx.CallBacks.add('jsxComponents-Keyboard-ServicePress' + this.id, jsx.bind(this, this.doFocus), this.keyboard.element);
        jsx.CallBacks.add('jsxComponents-Keyboard-KeyUp' + this.id, jsx.bind(this, this.doKeyUp), this.keyboard.element);
        
        if (this.input.active){
          this.openKeyboard();
        }
      };
      this.openKeyboard = function(){
        this.keyboard.setId(this.id);
        this.keyboard.setBoard(this.board, this.capitalize);
        jsx.Dom.insertAfter(this.keyboard.element, this.input);
      };
      this.type = function(e){
        this.selection.insert(e.value);
        this.input.focus();
      };
      this.doDelete = function(){
        this.selection.del();
        this.input.focus();
      };
      this.doEnter = function(){
        jsx.CallBacks.dispatch('jsxComponents-Keyboard-Enter', this.element);
      };
      this.doKeyUp = function(key){
        this.doFocus();
        jsx.CallBacks.dispatch('jsxComponents-Keyboard-KeyUp', this.element, key);
      };
      this.doFocus = function(){
        try {
          this.input.focus();
        }catch(e){};
      };
    },
    [
      'Dom',
      'Utils',
      'Events',
      'CallBacks',
      'Selection'
    ]
  );
});
