jsx.require(['{jsxComponents}.Keyboard', 'CallBacks'], function(){
  jsxComponents.Keyboard.Only = new function(){
    this.init = function(params){
      this.element = document.createElement('div');
      this.keyboard = new jsxComponents.Keyboard.Constructor(this.element, params || {});
      jsx.CallBacks.add('jsxComponents-Keyboard-Type', jsx.bind(this, this.proxy, 'jsxComponents-Keyboard-Type'), this.element);
      jsx.CallBacks.add('jsxComponents-Keyboard-Delete', jsx.bind(this, this.proxy, 'jsxComponents-Keyboard-Delete'), this.element);
      jsx.CallBacks.add('jsxComponents-Keyboard-Enter', jsx.bind(this, this.proxy, 'jsxComponents-Keyboard-Enter'), this.element);
      jsx.CallBacks.add('jsxComponents-Keyboard-ServicePress', jsx.bind(this, this.proxy, 'jsxComponents-Keyboard-ServicePress'), this.element);
      jsx.CallBacks.add('jsxComponents-Keyboard-KeyUp', jsx.bind(this, this.proxy, 'jsxComponents-Keyboard-KeyUp'), this.element);
    };
    this.setId = function(id){
      this.id = id;
    };
    this.setBoard = function(board, capitalize){
      this.keyboard.setBoard(board);
      this.keyboard.doCaps(capitalize || false);
    };
    this.proxy = function(eventName, e){
      jsx.CallBacks.dispatch(eventName + this.id || '', this.element, e);
    };
    this.init();
  };
  jsx.loaded('{jsxComponents}.Keyboard.Only');
});
