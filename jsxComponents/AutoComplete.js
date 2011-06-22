jsxComponents.AutoComplete = new function(){
  jsx.Links.createLink({href: jsx.ConstructURL.construct('{jsxComponents}.AutoComplete.style', 'css')});
  this.init = function(element, params){
    new jsxComponents.AutoComplete.Constructor(element, params);
  };
};

jsxComponents.AutoComplete.Constructor = function(element, params){
  this.element = element;
  var require = [];
  if (params.src){
    require.push('{jsxComponents}.AutoComplete.Loader');
  }
  if (params.server){
    require.push('{jsxComponents}.AutoComplete.ServerDataProccess');
  }else{
    require.push('{jsxComponents}.AutoComplete.LocalDataProccess');
  }
  jsx.require(require, jsx.bind(this, this.afterRequire, params));
  element = null;
};

jsxComponents.AutoComplete.Constructor.prototype = new function(){
  this.afterRequire = function(params){
    if (params.src){
      jsxComponents.AutoComplete.Loader.load(params.src, params.id || null, jsx.bind(this, this.initAfterLoad, params));
    }else{
      this.init(params);
    }
  };
  this.initAfterLoad = function(params, data){
    params.data = data;
    this.init(params);
  };
  this.reload = function(src, id, callback){
    jsxComponents.AutoComplete.Loader.load(src, id || null, jsx.bind(this, this.setReloadData, callback || jsx.Vars.NULL));
  };
  this.setReloadData = function(callback, data){
    this.setData(data);
    callback();
  };
  this.setData = function(data){
    this.dataProccessor.setData(data);
  };
  this.init = function(params){

    var data = params.data || '';

    this.input = jsx.Dom.getElementBySelector(this.element, '.jsxComponent-AutoComplete-Input');
    this.input.setAttribute('autocomplete', 'off');

    this.hidden = jsx.Dom.getElementBySelector(this.element, '.jsxComponent-AutoComplete-Hidden') || {value:''};

    this.dataProccessor = params.server ? new jsxComponents.AutoComplete.ServerDataProccess(params) : new jsxComponents.AutoComplete.LocalDataProccess(data);
    this.popup = jsx.Dom.getElementBySelector(this.element, '.jsxComponent-AutoComplete-PopUp') || this.createPopUp(params.rubber || false);
    this.content = jsx.Dom.getElementBySelector(this.element, '.jsxComponent-AutoComplete-PopUp-Content');
    this.viewProccessor = new jsxComponents.AutoComplete.ViewProccess(this.popup, this.content);

    this.setEvents();
    this.setSortCuts();

    this.value = '';
    this.changeAndSelectEqual(this.input.value);

    this.setView('clear');
    //this.setHidden(null);

    jsx.CallBacks.dispatch('jsxComponents-AutoComplete-AfterInit', this.element, this);
  };

  this.createPopUp = function(rubber){
    var fragment = document.createElement('div');
    fragment.innerHTML = ''
      + '<div class="b-autocomplete-hidden b-autoComplete-popup jsxComponent-AutoComplete-PopUp">'
        + '<iframe frameborder="no" scrolling="no" class="b-autoComplete-popup-iframe"></iframe>'
        + '<div class="b-autoComplete-popup-content ' + (rubber ? 'b-autoComplete-popup-content-rubber ' : '') + 'jsxComponent-AutoComplete-PopUp-Content">&#160;</div>'
      + '</div>';
    return this.getPopUpContatiner().appendChild(fragment.firstChild);
  };

  this.getPopUpContatiner = function(){
    var container = jsx.Dom.getElementBySelector(this.element, '.jsxComponent-AutoComplete-PopUpContainer');
    if (container){
      container.innerHTML = '';
      jsx.Dom.addClassName(container, 'b-autocomplete-popup-container');
    } else {
      var fragment = document.createElement('div');
      fragment.innerHTML = '<div class="b-autocomplete-popup-container"></div>';
      container = this.element.appendChild(fragment.firstChild);
    }
    return container;
  };

  this.setEvents = function(){
    if(this.input.form){
      this.stopSubmitEvent = jsx.Events.observe(this.input.form, 'submit', function(event){
        jsx.Events.stop(event);
      });
    } else {
      this.stopSubmitEvent = {stop:jsx.Vars.NULL, start:jsx.Vars.NULL};
    }
    this.stopSubmitEvent.stop();
    this.eKeyUp = jsx.Events.observe(this.input, 'keyup', jsx.bind(this, this.keyup));
    this.eKeyDown = jsx.Events.observe(this.input, 'keydown', jsx.bind(this, this.stopEvent));
    this.eBlur = jsx.Events.observe(this.input, 'blur', jsx.bind(this, this.closeByTimer));
    this.eClick = jsx.Events.observe(document.body, 'click', jsx.bind(this, this.closeByClick));
    this.eClick.stop();

    jsx.Events.observe(this.popup, 'mousedown', jsx.bind(this, this.disableCloseTimer));
    jsx.Events.observe(this.popup, 'mouseup', jsx.bind(this, this.enableCloseTimer));

    jsx.CallBacks.add('jsxComponents-AutoComplete-SelectItem', jsx.bind(this, this.typeSelected), this.popup);
    jsx.CallBacks.add('jsxComponents-AutoComplete-Stop', jsx.bind(this, this.stop), this.element);
    jsx.CallBacks.add('jsxComponents-AutoComplete-Start', jsx.bind(this, this.start), this.element);
    jsx.CallBacks.add('jsxComponents-AutoComplete-ReloadData', jsx.bind(this, this.reload), this.element);
    jsx.CallBacks.add('jsxComponents-AutoComplete-SetData', jsx.bind(this, this.setData), this.element);
    jsx.CallBacks.add('jsxComponents-AutoComplete-ForceCheck', jsx.bind(this, this._change), this.element);
    jsx.CallBacks.add('jsxComponents-AutoComplete-ForceCheckAndSelectFirst', jsx.bind(this, this.changeAndSelectFirst), this.element);
    jsx.CallBacks.add('jsxComponents-AutoComplete-ForceCheckAndSelectEqual', jsx.bind(this, this.changeAndSelectEqual), this.element);
    jsx.CallBacks.add('jsxComponents-AutoComplete-GetSelected', jsx.bind(this, this.getSelected), this.element);
    jsx.CallBacks.add('jsxComponents-AutoComplete-Close', jsx.bind(this, this.close), this.element);
    jsx.CallBacks.add('jsxComponents-AutoComplete-Clear', jsx.bind(this, this.clear), this.element);
  };
  this.keyup = function(e){
    jsx.CallBacks.dispatch('jsxComponents-AutoComplete-KeyUp', this.element, {
      event: e,
      value: this.input.value
    });
    this.change();
  };
  this.change = function(){
    if (this.timer){
      window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(jsx.bind(this, this._change), 300);
  };
  this._change = function(){
    this.stopSubmitEvent.stop();
    if(this.value == this.input.value){
      return;
    }
    this.value = this.input.value;
    this.dataProccessor.filter(this.input.value, jsx.bind(this, this.onFilterAndDraw));
  };
  this.check = function(){
    this.value = this.input.value;
    this.dataProccessor.filter(this.input.value, jsx.bind(this, this.onFilter));
  };
  this.onFilter = function(data){
    this.selected = null;
    this.input.setAttribute('style', '');
    if (this.isOnlyLeft(data)){
      this.setView('selected');
      //this.input.value = data[0].text;
      this.setHidden(data[0].value || null);
      this.input.setAttribute('style', data[0].style);
      this.selected = data[0];
      jsx.CallBacks.dispatch('jsxComponents-AutoComplete-Selected', this.element, {data: data[0], input: this.input.value});
      data = null;
    } else if(!data && this.input.value != '') {
      this.setView('null');
      this.setHidden(null);
      jsx.CallBacks.dispatch('jsxComponents-AutoComplete-Null', this.element);
    } else if(!data && this.input.value == '') {
      this.setView('clear');
      this.setHidden(null);
      jsx.CallBacks.dispatch('jsxComponents-AutoComplete-Clear', this.element);
    } else {
      this.setView('filled');
      this.eClick.start();
      this.setHidden(null);
      jsx.CallBacks.dispatch('jsxComponents-AutoComplete-Filled', this.element);
    }
    return data;
  };
  this.onFilterAndDraw = function(data){
    this.viewProccessor.draw(this.onFilter(data));
  };

  this.changeAndSelectFirst = function(){
    this.value = this.input.value;
    this.dataProccessor.filter(this.input.value, jsx.bind(this, this.onFilterAndSelectFirst));
  };

  this.changeAndSelectEqual = function(text){
    this.value = this.input.value;
    this.dataProccessor.filter(this.input.value, jsx.bind(this, this.onFilterAndSelectEqual, text));
  };

  this.onFilterAndSelectFirst = function(data){
    if (data){
      this.value = data[0].text;
    }
    this.onFilter(data ? [data[0]] : null);
  };

  this.onFilterAndSelectEqual = function(text, data){
    if (!data){
      this.onFilter(null);
      return;
    }
    var equal = null;
    for (var i = 0, l = data.length; i < l; i++) {
      if (data[i].text.toLowerCase() == text.toLowerCase()) {
        equal = data[i];
        this.value = equal.text;
        break;
      }
    }
    this.onFilter([equal]);
  };

  this.setHidden = function(value){
    if (value) {
      this.hidden.value = value;
      this.hidden.disabled = false;
    }else{
      this.hidden.disabled = true;
    }
  };

  this.typeSelected = function(){
    var selected = this.viewProccessor.getSelected();
    this.stopSubmitEvent.stop();
    if (!selected){
      jsx.CallBacks.dispatch('jsxComponents-AutoComplete-Selected-Empty', this.element);
      this.viewProccessor.draw(null);
      return;
    }
    this.input.value = selected.text;
    this.value = this.input.value;
    var data = this.dataProccessor.getOne(this.value);
    this.selected = data;
    this.setHidden(data ? data.value : null);
    this.setView('selected');
    this.viewProccessor.draw(null);
    jsx.CallBacks.dispatch('jsxComponents-AutoComplete-Selected', this.element, {data: data, input: this.input.value});
    jsx.CallBacks.dispatch('jsxComponents-AutoComplete-Selected-Forced', this.element, {data: data, input: this.input.value});
  };

  this.isOnlyLeft = function(data){
    return (data && data.length == 1 && data[0] && data[0].text.toLowerCase() == this.value.toLowerCase());
  };

  this.getSelected = function(){
    jsx.CallBacks.dispatch('jsxComponents-AutoComplete-DispatchSelected', this.element, {data: this.selected, input: this.input.value});
  };

  this.onGetSelectedFilter = function(selected, data){
    selected.tag = this.isOnlyLeft(data) ? {data: data[0], input: this.input.value} : null;
  };

  this.setView = function(view){
    jsx.Dom.removeClassName(this.element, 'jsx-component-autocomplete-selected');
    jsx.Dom.removeClassName(this.element, 'jsx-component-autocomplete-null');
    jsx.Dom.removeClassName(this.element, 'jsx-component-autocomplete-clear');
    jsx.Dom.removeClassName(this.element, 'jsx-component-autocomplete-filled');

    jsx.Dom.removeClassName(this.input, 'qa-autocomplete-selected');
    jsx.Dom.removeClassName(this.input, 'qa-autocomplete-null');
    jsx.Dom.removeClassName(this.input, 'qa-autocomplete-clear');
    jsx.Dom.removeClassName(this.input, 'qa-autocomplete-filled');


    jsx.Dom.addClassName(this.element, 'jsx-component-autocomplete-' + view);
    jsx.Dom.addClassName(this.input, 'qa-autocomplete-' + view);
    this.state = view;
  };
  this.setSortCuts = function(){
    this.skUp = jsx.ShortCuts.down([{key: jsx.ShortCuts.UP_ARROW}], jsx.bind(this, this.arrowUp), this.input, false);
    this.skDown = jsx.ShortCuts.down([{key: jsx.ShortCuts.DOWN_ARROW}], jsx.bind(this, this.arrowDown), this.input, false);
    this.skEnter = jsx.ShortCuts.down([{key: jsx.ShortCuts.ENTER}], jsx.bind(this, this.typeSelected), this.input, false);
    this.skEsc = jsx.ShortCuts.down([{key: jsx.ShortCuts.ESC}], jsx.bind(this, this.close), this.input, false);
  };

  this.arrowUp = function(){
    this.viewProccessor.moveUp();
  };

  this.arrowDown = function(){
    this.viewProccessor.moveDown();
  };


  this.closeByClick = function(event){
    if (jsx.Dom.descendantOf(jsx.Events.element(event), this.element)){
      return;
    }
    this.close();
  };

  this._closeByTimer = function(){
    this.closeTimer = window.setTimeout(jsx.bind(this, this.close), 100);
  };

  this.closeByTimer = function(){
    this.closeByTimerFlag ? this._closeByTimer : jsx.Vars.NULL;
  };

  this.disableCloseTimer = function(){
    this.closeByTimerFlag = false;
  };

  this.enableCloseTimer = function(){
    this.closeByTimerFlag = true;
  };

  this.enableCloseTimer();

  this.close = function(){
    this.value = this.input.value;
    this.viewProccessor.close();
    this.eClick.stop();
  };

  this.clear = function(){
    this.input.value = '';
    this._change();
  };

  this.stopEvent = function(event){
    if (this.state == 'clear' || this.state == 'selected' || this.state == 'null' || (this.state == 'filled' && !this.viewProccessor.getSelected())){
      this.skEnter.stop();
      return;
    }
    this.skEnter.start();
    this.stopSubmitEvent.start();
  };

  this.start = function(){
    this.eKeyUp.start();
    this.eKeyDown.start();
    this.eBlur.start();
    this.eClick.start();

    this.skUp.start();
    this.skDown.start();
    this.skEnter.start();
    this.skEsc.start();
  };

  this.stop = function(){
    this.eKeyUp.stop();
    this.eKeyDown.stop();
    this.eBlur.stop();
    this.eClick.stop();

    this.skUp.stop();
    this.skDown.stop();
    this.skEnter.stop();
    this.skEsc.stop();

    this.close();
  };

};


jsx.require(['{jsxComponents}.AutoComplete.ViewProccess', 'Dom', 'Events', 'ShortCuts', 'CallBacks', 'Strings'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.AutoComplete'));