jsxComponents.Editor.Textarea = function(element){
  this.create(element);
};
jsxComponents.Editor.Textarea.prototype = new function(){
  this.create = function(element){
    this.element = element;
    jsx.Dom.addClassName(this.element, 'jsxComponents-Editor-Texarea');
  };
  this.getElement = function(){
    return this.element;
  };
  this.setValue = function(value){
    this.element.value = value;
  };
  this.getValue = function(){
    return this.element.value;
  };
  this.hide = function(){
    this.element.style.display = 'none';
  };
  this.show = function(){
    this.element.style.display = 'block';
  };
};
jsx.loaded('{jsxComponents}.Editor.Textarea');
