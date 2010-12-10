jsx.Components.buildComponent('{jsxComponents}.Keyboard',
  function(){
    jsx.Links.createLink({href: jsx.ConstructURL.construct('{jsxComponents}.Keyboard.Keyboard', 'css')});
    this.init = function(element, params){
      this.element = element;
      this.setBoard(params.board || 'RuABC');
      this.doCaps(params.capitalize || false);
    };
    this.doCaps = function(capitalize){
      if (this.capitalize === capitalize){
        return;
      }
      this.capitalize = capitalize;
      this.setBoard(this.board);
      jsx.CallBacks.dispatch('jsxComponents-Keyboard-ServicePress', this.element);
    };
    this.doLang = function(board){
      this.setBoard(board);
      jsx.CallBacks.dispatch('jsxComponents-Keyboard-ServicePress', this.element);
    };
    this.doNumbers = function(board){
      this.setBoard(board);
      jsx.CallBacks.dispatch('jsxComponents-Keyboard-ServicePress', this.element);
    };
    this.doSymbols = function(board){
      this.setBoard(board);
      jsx.CallBacks.dispatch('jsxComponents-Keyboard-ServicePress', this.element);
    };
    this.doType = function(value){
      jsx.CallBacks.dispatch('jsxComponents-Keyboard-Type', this.element, {value: value});
    };
    this.doSpace = function(value){
      this.doType(value);
    };
    this.doBackspace = function(value){
      jsx.CallBacks.dispatch('jsxComponents-Keyboard-Delete', this.element);
    };
    this.doMonth = function(value){
      jsx.CallBacks.dispatch('jsxComponents-Keyboard-Type', this.element, {value: value});
    };
    this.doEnter = function(value){
      jsx.CallBacks.dispatch('jsxComponents-Keyboard-Enter', this.element);
    };
    this.doUp = function(key){
      jsx.CallBacks.dispatch('jsxComponents-Keyboard-KeyUp', this.element);
      if (key.type != 'Caps'){
        this.doCaps(false);
      }
    };
    this.setBoard = function(board){
      this.board = board ? (typeof board == 'string' ? jsxComponents.Keyboard.Boards[board] : board) : this.board;
      this.element.innerHTML = '<div class="jsxComponents-Keyboard"><div class="jsxComponents-Keyboard-Board"></div></div>';
      this.box = jsx.Dom.$$(this.element, '.jsxComponents-Keyboard-Board');
      this.board.forEach(jsx.bind(this, this.setLine));
    };
    this.setLine = function(line){
      var lineBox = this.box.appendChild(document.createElement('div'));
      jsx.Dom.addClassName(lineBox, 'jsxComponents-Keyboard-Line');
      
      line.forEach(jsx.bind(this, this.setKey, lineBox));
    };
    this.setKey = function(line, key){
      var type = key.type;
      key = new jsxComponents.Keyboard.Keys[type](key, this.capitalize);

      jsx.CallBacks.add('jsxComponents-Keyboard-Press', jsx.bind(this, this['do' + type]), key.element);
      jsx.CallBacks.add('jsxComponents-Keyboard-Up', jsx.bind(this, this.doUp), key.element);

      line.appendChild(key.element);
    };
  },
  [
    'Dom',
    'Events',
    'CallBacks',
    '{jsxComponents}.Keyboard.Keys',
    '{jsxComponents}.Keyboard.Boards'
  ]
);
