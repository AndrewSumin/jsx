jsxComponents.ToggleBlock = new function(){
  this.init = function(element, params){
    new jsxComponents.ToggleBlock.Constructor(element, params);
  };
};

jsxComponents.ToggleBlock.Constructor = function (element, params){
  this.init(element, params);
};

jsxComponents.ToggleBlock.Constructor.prototype = new function(){
  this.init = function(element, params){
    this.element = element;
    this.params = params;
    this.name = params.name ? '-' + params.name : '';
    this.collapseClass = params.collapseClass || '';
    this.expandClass = params.expandClass || 'g-expand' + this.name;
    this.checkClosed();

    this.switchers = jsx.Dom.getElementsBySelector(this.element, '.jsxComponents-ToggleBlock-Switcher' + this.name);
    this.switchers.map(jsx.bind(this, this.observeSwitcher));

    if (params.closeByClick){
      this.closeByClickEvent = jsx.Events.observe(document.body, 'click', jsx.bind(this, this.closeByClick));
      if (this.closed)
        this.closeByClickEvent.stop();
    }

    jsx.CallBacks.add('ToggleBlockClick', jsx.bind(this, this.click), this.element);
    this.params = params;
    if (params.id && window.location.hash.replace('#', '') == params.id){
      this.click('expand');
    }

    this.input = jsx.Dom.$$(this.element, '.jsxComponents-ToggleBlock-Input' + this.name);
    if (this.input) {
      this.checkInput();
    }
  };

  this.checkClosed = function() {
    if (this.collapseClass) this.closed = jsx.Dom.hasClassName(this.element,this.collapseClass);
    if (this.expandClass) this.closed = !jsx.Dom.hasClassName(this.element,this.expandClass);
  };

  this.click = function(event){

    switch (event){

      case 'expand':
        if (this.collapseClass) jsx.Dom.removeClassName(this.element, this.collapseClass);
        if (this.expandClass) jsx.Dom.addClassName(this.element, this.expandClass);
        this.closed = false;
        this.dispatch();
        if (this.closeByClickEvent)
          this.closeByClickEvent.start();
        break;

      case 'collapse':
        if (this.expandClass) jsx.Dom.removeClassName(this.element, this.expandClass);
        if (this.collapseClass) jsx.Dom.addClassName(this.element, this.collapseClass);
        this.closed = true;
        this.dispatch();
        if (this.closeByClickEvent)
          this.closeByClickEvent.stop();
        break;

    }

  };

  this.closeByClick = function(event){
    var target = jsx.Events.element(event);
    if (jsx.Dom.descendantOf(target, this.element)){
      return;
    }
    this.click('collapse');
  };

  this.observeSwitcher = function(switcher){
    jsx.Events.observe(switcher, 'click', jsx.bind(this, this.switchBlock));
  };

  this.switchBlock = function(event){
    if (!jsx.Dom.hasClassName(event.target,'jsxComponents-ToggleBlock-Switcher-Force')) {
      jsx.Events.preventDefault(event);
    }
    this.checkClosed();
    if (this.closed) {
      this.click('expand');
    } else {
      this.click('collapse');
    }
  };

  this.checkInput = function(){
    if (this.input.checked && this.closed){
      this.click('expand');
    }else if(!this.input.checked && !this.closed){
      this.click('collapse');
    }
    window.setTimeout(jsx.bind(this, this.checkInput), 50);
  };

  this.dispatch = function(){
    var switchState = jsx.Dom.hasClassName(this.element, this.expandClass) ? 'expand' : 'collapse';
    jsx.CallBacks.dispatch('jsxComponents-ToggleBlock-Switch', this.element, switchState);
    if (this.params.forceRedraw) {
      jsx.Dom.redraw();
    }
  };


};

jsx.require(['Dom', 'Events', 'CallBacks'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.ToggleBlock'));