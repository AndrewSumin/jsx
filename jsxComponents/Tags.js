jsx.Links.createLink({href: jsx.ConstructURL.construct('{jsxComponents}.Tags.style', 'css')});
jsx.Components.buildComponent('{jsxComponents}.Tags',
  function(){
    this.ERROR_CLASS = 'jsxComponent-Tags-Item-Text-Error';
    this.TAG = '' 
      + '<li class="jsxComponent-Tags-Item">'
        + '<input type="hidden" name="%name%" value="%value%" class="jsxComponent-Tags-Item-Value"/>'
        + '<span class="jsxComponent-Tags-Item-Text %error%" style="%style%">%text%</span>'
        + '<a class="jsxComponent-Tags-Item-Delete" href="#">&#215;</a>'
      + '</li>';
    
    this.init = function(element, params){
      this.element = element;
      this.requestname = params.requestname || '';
      this.autosuggest = params.autosuggest;
      this.cookies = params.cookies;
      this.input = jsx.Dom.getElementBySelector(this.element, '.jsxComponent-Tags-Input');
      this.appender = jsx.Dom.getElementBySelector(this.element, '.jsxComponent-Tags-Appender') || document.createElement('a');
      this.list = this.getTagList();
      
      jsx.CallBacks.add('jsxComponents-AutoComplete-Selected-Forced', jsx.bind(this, this.autoCompleteAppend), this.element);
      jsx.CallBacks.add('jsxComponents-AutoComplete-DispatchSelected', jsx.bind(this, this.autoCompleteAppend), this.element);
      
      jsx.Events.observe(this.appender, 'click', jsx.bind(this, this.plusAppend));
      jsx.Events.observe(this.list, 'click', jsx.bind(this, this.doAction));
      
      this.skEnter = jsx.ShortCuts.down([{key: jsx.ShortCuts.ENTER}], jsx.bind(this, this.getAndAppend), this.input, false);
      
      this.checkFilled();
      
      this.dispatch();
      jsx.CallBacks.add('jsxComponents-Tags-Dispatch', jsx.bind(this, this.dispatch), this.element);
      jsx.CallBacks.add('jsxComponents-Tags-Set', jsx.bind(this, this.setTags), this.element);
    };
    
    this.getTagList = function(){
      var list = jsx.Dom.getElementBySelector(this.element, '.jsxComponent-Tags-List') || this.element.appendChild(document.createElement('ul'));
      jsx.Dom.addClassName(list, 'jsxComponent-Tags-List');
      return list;
    };
    
    
    this.autoCompleteAppend = function(tag){
      var text, value, style, error = false;
      if (this.autosuggest == 'hard' && (!tag || !tag.data)){
        return;
      }else if (!tag || !tag.data){
        text = this.input.value;
        value = this.input.value;
        error = true;
      }else{
        text = tag.data.text;
        value = tag.data.value;
        style = tag.data.style;
      }
      this.appendTag({value: value , text: text, style: style, error:error});
      jsx.CallBacks.dispatch('jsxComponents-AutoComplete-Clear', this.element);
    };
    
    
    this.plusAppend = function(event){
      jsx.Events.stop(event);
      jsx.CallBacks.dispatch('jsxComponents-AutoComplete-GetSelected', this.element);
    };
    
    this.getAndAppend = function(){
      jsx.CallBacks.dispatch('jsxComponents-AutoComplete-GetSelected', this.element);
    };

    
    this.doAction = function(event){
      var element = jsx.Events.element(event);
      if (jsx.Dom.hasClassName(element, 'jsxComponent-Tags-Item-Delete')){
        jsx.Events.stop(event);
        this.deleteTag(element.parentNode);
      }
    };
    
    this.setTags = function(tags){
      this.clearTags();
      this.appendTags(tags);
    };
    this.appendTags = function(tags){
      tags = (tags.length || tags.length === 0 ? tags : [tags]);
      tags.forEach(jsx.bind(this, this.appendTag));
    };
    
    this.appendTag = function(tag){
      if (tag.text === '' || this.getTagsText().indexOf(tag.text) != -1){
        return;
      }
      jsx.CallBacks.dispatch('jsxComponents-Tags-Add', this.element, tag);
      tag = this.TAG
        .replace(/%name%/, this.requestname)
        .replace(/%value%/, tag.value)
        .replace(/%text%/, tag.text)
        .replace(/%style%/, tag.style || '')
        .replace(/%error%/, tag.error ? this.ERROR_CLASS : '');
      tag = jsx.Dom.doHTMLElement(tag);
      this.list.appendChild(tag);
      this.setView('filled');
      this.dispatch();
    };
    
    this.clearTags = function(){
      jsx.Dom.getElementsBySelector(this.element, '.jsxComponent-Tags-Item').forEach(jsx.bind(this, this.deleteTag));
    };
    this.deleteTag = function(tag){
      tag.parentNode.removeChild(tag);
      this.checkFilled();
      this.input.focus();
      jsx.CallBacks.dispatch('jsxComponents-Tags-Remove', this.element, {
        text: jsx.Dom.$$(tag, '.jsxComponent-Tags-Item-Text').innerHTML
      });
      this.dispatch();
    };
    
    this.dispatch = function(){
      this.saveToCookies();
      var tags = this.getTags();
      jsx.CallBacks.dispatch('jsxComponents-Tags-Change', this.element, tags);
    };
    
    this.saveToCookies = function(){
      if (this.cookies) {
        jsx.Cookies.set(this.cookies, this.tagsToString(this.getTags()), 24 * 365 * 10);
      }
    };
    
    this.tagsToString = function(tags){
      return tags.map(jsx.bind(this, this.tagToString)).join('|');
    };
    
    this.tagToString = function(tag){
      return tag.value;
    };

    
    this.checkFilled = function(){
      if (this.getTagsText().length > 0){
        this.setView('filled');
      }else{
        this.setView('empty');
      }
    };
    
    this.setView = function(view){
      jsx.Dom.removeClassName(this.element, 'jsx-component-tags-filled');
      jsx.Dom.removeClassName(this.element, 'jsx-component-tags-empty');
  
      jsx.Dom.addClassName(this.element, 'jsx-component-tags-' + view);
    };
    
    this.getTags = function(){
      return jsx.Dom.getElementsBySelector(this.element, '.jsxComponent-Tags-Item').map(jsx.bind(this, this.getTagsData));
    };
    
    this.getTagsData = function(tag){
      return {
        text: jsx.Dom.getElementBySelector(tag, '.jsxComponent-Tags-Item-Text').innerHTML,
        value: jsx.Dom.getElementBySelector(tag, 'input').value 
      }
    };
    
    this.getTagsText = function(){
      return jsx.Dom.getElementsBySelector(this.element, '.jsxComponent-Tags-Item-Text').map(this.getTagText);
    };
    
    this.getTagText = function(tag){
      return tag.innerHTML;
    };
  },
  ['Dom', 'Events', 'CallBacks', 'Cookies', 'ShortCuts']
);

