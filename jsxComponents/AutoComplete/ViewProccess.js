jsxComponents.AutoComplete.ViewProccess = function(element, content){
  this.element = element;
  this.content = content;
  this.selectedIndex = -1;
};
jsxComponents.AutoComplete.ViewProccess.prototype = new function(){
  this.draw = function(items){
    this.unsetSelected();
    if (!items){
      this.close();
      return;
    }
    jsx.Dom.removeClassName(this.element, 'b-autocomplete-hidden');
    items = items.map(jsx.bind(this, this.drawItem));
    this.content.innerHTML = items.join('');
    this.cashItems();
    //this.setActive(0);
    this.setItemsEvents();
  };
  this.close = function(){
    this.selectedIndex = -1;
    jsx.Dom.addClassName(this.element, 'b-autocomplete-hidden');
    this.content.innerHTML = '';
  };
  this.drawItem = function(item){
    return ''
      +'<div class="b-autoComplete-popup-item" style="' + item.style + '">'
        + '<input type="hidden" class="value" value="' + item.value + '"/>'
        + '<span>' + item.text + '</span>'
      + '</div>';
  };
  this.cashItems = function(){
    this.items = jsx.Dom.getElementsBySelector(this.content, '.b-autoComplete-popup-item');
    this.items.forEach(jsx.bind(this, this.setAttributes));
  };
  this.setAttributes = function(item, index){
    item.index = index;
  };
  this.setItemsEvents = function(){
    this.items.forEach(jsx.bind(this, this.setItemEvents));
  };
  this.setItemEvents = function(item){
    jsx.Events.observe(item, 'mouseover', jsx.bind(this, this.setActive, item.index));
    jsx.Events.observe(item, 'click', jsx.bind(this, this.selectItem, item));    
  };
  this.selectItem = function(item){
    jsx.CallBacks.dispatch('jsxComponents-AutoComplete-SelectItem', this.element);
  };
  this.moveUp = function(){
    if (this.selectedIndex == -1){
      return;
    }
    this.setActive(this.selectedIndex - 1);
  };
  this.moveDown = function(){
    if (this.selectedIndex == this.items.length - 1){
      return;
    }
    this.setActive(this.selectedIndex + 1);
  };
  this.setActive = function(index){
    if (index == this.selectedIndex){
      return;
    }
    this.unsetSelected();
    this.selectedIndex = index;
    if (index == -1){
      return;
    }
    jsx.Dom.addClassName(this.items[index], 'b-autoComplete-popup-item-selected');
    this.scrollIntoViewTop();
    this.scrollIntoViewBottom();
  };
  this.unsetSelected = function(){
    if (this.selectedIndex == -1) {
      return;
    }
    jsx.Dom.removeClassName(this.items[this.selectedIndex], 'b-autoComplete-popup-item-selected');
    this.selectedIndex = -1;
  };
  this.getSelected = function(){
    if (this.selectedIndex == -1){
      return null;
    }
    var item = this.items[this.selectedIndex];
    return {
      value: jsx.Dom.getElementBySelector(item, '.value').value, 
      text: jsx.Dom.getElementBySelector(item, 'span').innerHTML
    };
  };
  
  this.scrollIntoViewTop = function(){
    if (this.selectedIndex == 0 && this.content.scrollTop == 0){
      return;
    }
    var item = this.items[this.selectedIndex];
    var itemTop = jsx.Dom.offset(item).top - jsx.Dom.offset(this.content).top - item.offsetHeight;
    if (itemTop <= this.content.scrollTop){
      this.content.scrollTop = itemTop;
    }
  };
  this.scrollIntoViewBottom = function(){
    var item = this.items[this.selectedIndex];
    var itemBottom = jsx.Dom.offset(item).top - jsx.Dom.offset(this.content).top + item.offsetHeight * 2;
    if (itemBottom > this.content.scrollTop + this.content.offsetHeight){
      this.content.scrollTop = itemBottom - this.content.offsetHeight;
    }
  };
};
jsx.require(['CallBacks', 'Dom'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.AutoComplete.ViewProccess'));