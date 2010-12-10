jsxComponents.Hint = new function(){
  jsx.Links.createLink({href: jsx.ConstructURL.construct('{jsxComponents}.Hint.style', 'css')});
  this.init = function(element, params){
    new jsxComponents.Hint.Constructor(element, params);
  };
};

jsxComponents.Hint.Constructor = function(element, params){
  this.init(element, params);
  element = null;
};

jsxComponents.Hint.Constructor.prototype = new function(){

  this.init = function(element, params){
    this.element = element;
    this.input = jsx.Dom.$$(this.element, '.jsxComponents-Hint-Input') || jsx.Dom.$$(this.element, 'input') ;
    this.hints = jsx.Dom.getElementsBySelector(this.element, '.jsxComponents-Hint-List-Item');
    this.hints.forEach(jsx.bind(this, this.makeHint));
    this.afterFillEvent = jsx.CallBacks.add('jsxComponents-AutoComplete-Selected', jsx.bind(this, this.afterFill), this.element);
    this.afterFillEvent.stop();
  };

  this.makeHint = function(hint){
    jsx.Events.observe(hint, 'click', jsx.bind(this, this.fillInput, hint.innerHTML));
  };

  this.fillInput = function(text){
    this.input.value = text;
    this.afterFillEvent.start();
    jsx.CallBacks.dispatch('jsxComponents-AutoComplete-ForceCheckAndSelectFirst', this.element);
    jsx.CallBacks.dispatch('jsxComponents-Hint-InputFilled', this.input, text);
    this.input.focus();
  };

  this.afterFill = function(){
    jsx.CallBacks.dispatch('jsxComponents-Hint-Selected', this.element, this.input.value);
    this.input.focus();
    this.afterFillEvent.stop();
  };

  this.garbageCollector = function(){
    this.element = null;
  };

};

jsx.require(['Dom', 'Events'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.Hint'));