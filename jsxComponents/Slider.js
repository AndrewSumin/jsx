jsxComponents.Slider = new function(){
  jsx.Links.createLink({href: jsx.ConstructURL.construct('{jsxComponents}.Slider.style', 'css')});
  this.init = function(element, params){
    new jsxComponents.Slider.Constructor(element, params);
  };
};

jsxComponents.Slider.Constructor = function(slider, params){
  this.slider = slider;
  this.isVertical = params.orientation != 'horizontal';
  this.index = null;
  this.coefficient = 1;
  this.range = params.range || null;
  this.values = this.getValuesFromParams(params);
  this.init(slider, params);
};

jsxComponents.Slider.Constructor.prototype = new function () {

  this.init = function (slider, params) {

    this.button = jsx.Dom.getElementBySelector(this.slider, '.jsxComponents-Slider-Button') || null;
    this.scale = jsx.Dom.getElementBySelector(this.slider, '.jsxComponents-Slider-Scale');
    this.grab = jsx.Dom.getElementBySelector(this.slider, '.jsxComponents-Slider-Grab');
    this.hidden = jsx.Dom.getElementBySelector(this.slider, '.jsxComponents-Slider-Hidden');
    this.plus = jsx.Dom.getElementBySelector(this.slider, '.jsxComponents-Slider-Plus') || null;
    this.minus = jsx.Dom.getElementBySelector(this.slider, '.jsxComponents-Slider-Minus') || null;
    this.cachePlusMinus();
    this.mouse = new jsx.DragAndDrop.MouseMove(this.scale);

    this.setMouseListeners();
    this.setShortCuts();

    jsx.CallBacks.add('jsxComponents-Slider-DispatchStatus', jsx.bind(this, this.dispatchMove), this.slider);
    this.maxIndex = this.values ? this.values.length - 1 : this.scaleSize;
    jsx.CallBacks.add('jsxComponents-Slider-SetValue', jsx.bind(this, this.setIndexForce), this.slider);
    jsx.CallBacks.add('jsxComponents-Slider-SetValueByValue', jsx.bind(this, this.setValueForce), this.slider);
    this.index = this.getIndexFromValue(params.value || this.hidden.value);
    this.waitFoRenderAndSetIndex();

    this.grab.style.visibility = 'visible';

  };

  this._init = function(index){
    //console.log('_init');
    this.countSliderSizeOffsetAndStep();
    this.setIndex(index);
  };

  this.waitFoRenderAndSetIndex = function(){
    //console.log('waitFoRenderAndSetIndex',index);
    if ((this.grab.offsetHeight != 0 || this.grab.offsetWidth != 0) && (this.scale.offsetHeight != 0 || this.scale.offsetWidth != 0)){
      this._init(this.index);
    } else{
      window.setTimeout(jsx.bind(this, this.waitFoRenderAndSetIndex), 500);
    }
  };

  this.getValuesFromParams = function(params){
    if (params.values){
      return params.values;
    }
    if (params.range){
      var step = params.step || 1;
      while(Math.abs(step) < 1) {
        this.coefficient *= 10;
        step *= 10;
      }
      var curVal = params.range[0] * this.coefficient;
      var end = params.range[1] * this.coefficient;
      var array = [];
      if (curVal < end) {
        while(curVal < end) {
          array[array.length] = curVal;
          curVal += step;
        }
      } else {
        while(curVal > end) {
          array[array.length] = curVal;
          curVal -= step;
        }
      }
      array[array.length] = end;
      return array;
    }
    return null;
  };

  this.cachePlusMinus = function(){
    if (this.plus == null || this.minus == null){
      return;
    }

    this.getPlusMinusURLs('plus');
    this.getPlusMinusURLs('minus');
  };

  this.getPlusMinusURLs = function(name){
    this[name].onerror = function(){
      this.src = _this[name + 'Src'];
    };
    this[name + 'Src'] = this[name].src;
    this[name + 'SrcDisabled'] = this[name].src.replace(/\.([a-zA-Z]*)$/, '-disabled.$1');
    this[name + 'Disabled'] = new Image();
    var _this = this;
    this[name + 'Disabled'].onerror = function(){
      _this[name + 'SrcDisabled'] = _this[name + 'Src'];
    };
    this[name + 'Disabled'].src = this[name + 'SrcDisabled'];
  };

  this.countSliderSize = function(){
    if (this.isVertical){
      this.grabSize = Math.floor( this.grab.offsetHeight );
      this.scaleSize = this.scale.offsetHeight;
    }else{
      this.grabSize = Math.floor( this.grab.offsetWidth );
      this.scaleSize = this.scale.offsetWidth;
    }
  };

  this.countSliderOffset = function(){
    if (this.isVertical){
      this.scaleOffset = jsx.Dom.offset(this.scale).top;
    }else{
      this.scaleOffset = jsx.Dom.offset(this.scale).left;
    }
  };

  this.countSliderStep = function(){
    this.step = (this.scaleSize - 1) / this.maxIndex;
  };

  this.countSliderSizeOffsetAndStep = function(){
    this.countSliderSize();
    this.countSliderOffset();
    this.countSliderStep();
  };

  this.setMouseListeners = function(){
    jsx.CallBacks.add('start', jsx.bind(this, this.start), this.mouse, true);
    jsx.CallBacks.add('move', jsx.bind(this, this.move), this.mouse, true);
    jsx.CallBacks.add('stop', jsx.bind(this, this.stop), this.mouse, true);

    var _this = this;

    jsx.Events.observe(this.scale, 'mousedown', jsx.bind(this, this.click));

    if (this.plus){
      function plus(e){
        jsx.Events.stop(e);
        _this.setIndex(_this.index + 1);
      }
      jsx.Events.observe(this.plus, 'click', plus);
    }

    if (this.minus){
      function minus(e){
        jsx.Events.stop(e);
        _this.setIndex(_this.index - 1);
      }
      jsx.Events.observe(this.minus, 'click', minus);
    }

    //this.scale.observe('DOMMouseScroll', this.scroll.bindAsEventListener(this));

  };

  this.setShortCuts = function(){
    if (!this.button){
      return;
    }
    var _this = this;
    var increaseKey = this.isVertical ? {key:jsx.ShortCuts.UP_ARROW} : {key:jsx.ShortCuts.RIGHT_ARROW};
    var decreaseKey = this.isVertical ? {key:jsx.ShortCuts.DOWN_ARROW} : {key:jsx.ShortCuts.LEFT_ARROW};

    function decrease(){
      _this.setIndex(_this.index - 1);
    }
    jsx.ShortCuts.press([decreaseKey], decrease, this.button, true);
    jsx.ShortCuts.down([{key:jsx.ShortCuts.MINUS_NUM}], decrease, this.button, true);

    function increase(){
      _this.setIndex(_this.index + 1);
    }
    jsx.ShortCuts.press([increaseKey], increase, this.button, true);
    jsx.ShortCuts.down([{key:jsx.ShortCuts.PLUS_NUM}], increase, this.button, true);

    function home(){
      _this.setIndex(0);
    }
    jsx.ShortCuts.press([{key:jsx.ShortCuts.HOME}], home, this.button, true);

    function end(){
      _this.setIndex(_this.maxIndex);
    }
    jsx.ShortCuts.press([{key:jsx.ShortCuts.END}], end, this.button, true);
  };

  this.cropIndex = function(index){
    return Math.max(0, Math.min(this.maxIndex, index));
  };

  this.getValueFromIndex = function (index){
    return this.values ? this.values[index] / this.coefficient : index;
  };

  this.saveValueToHidden = function(index){
    this.hidden.value = this.getValueFromIndex(index);
  };

  this.getIndexFromValue = function (value){
    value *= this.coefficient;
    var index = this.values ? this.values.indexOf(value) : value;
    //console.log(this,'from',value,'index',index,'with',this.coefficient);
    return index != -1 ? index : 0;
  };

  this.setValueFromIndex = function(index){
    index = this.cropIndex(index);
    this.enableDisableIMG('plus', (index == this.maxIndex));
    this.enableDisableIMG('minus', (index === 0));
    if (this.isVertical){
      // invert because zero on the bottom, but opera 8.5 doesn't allow to set style.bottom;
      this.grab.style.top = (this.scaleSize - this.grabSize) - this.getOffsetFromIndex(index) + 'px';
    }else{
      this.grab.style.left = this.getOffsetFromIndex(index) + 'px';
    }
    if (this.index == index){
      return false;
    }
    this.index = index;
    this.saveValueToHidden(this.index);
    return true;
  };

  this.getOffsetFromIndex = function(index){
    return ((index != this.maxIndex ? Math.round(index * this.step) : this.scaleSize - 1) - Math.floor(this.grabSize / 2));
  };

  this.countIndexFromOffset = function(offset){
    return Math.round(offset / this.step);
  };

  this.getOffset = function(e){
    if (this.isVertical){
      // Y zero is on top but max value is on top too
      return this.scaleSize - parseInt(e.clientY) - parseInt(document.body.scrollTop) + this.scaleOffset;
    }
    // Y zero is on left
    return parseInt(e.clientX) + parseInt(document.body.scrollLeft) - this.scaleOffset;
  };

  this.moveToIndex = function(index){
    if (this.setValueFromIndex(index)){
      this.dispatchMove();
    }
  };

  this.dispatchMove = function(){
    if (!this.dontDispatch) {
      jsx.CallBacks.dispatch('jsxComponents-Slider-Move', this.slider, {
        value: this.getValueFromIndex(this.index),
        range: this.range
      });
    }
  };

  this.setIndex = function(index){
    //console.log('setIndex',index);
    this.start();
    this.moveToIndex(index);
    this.stop();
  };

  this.setValueForce = function(value){
    this.setIndexForce(this.getIndexFromValue(value));
  };
  this.setIndexForce = function(index){
    this.dontDispatch = true;
    this.start();
    this.moveToIndex(index);
    this.stop();
    this.dontDispatch = false;
  };

  this.move = function(e){
    var index = this.countIndexFromOffset(this.getOffset(e));
    this.moveToIndex(index);
  };

  this.start = function(){
    this.countSliderSizeOffsetAndStep();
    this.startIndex = this.index;
  };

  this.stop = function(){
    if (this.startIndex != this.index){
      jsx.CallBacks.dispatch('jsxComponents-Slider-Change', this.slider, this.getValueFromIndex(this.index));
      this.startIndex = this.index;
    }
  };

  this.click = function(e){
    // this.start(); mousedown makes start.
    this.move(e);
    this.stop();
  };
/*
  this.scroll = function(e){
    if (e.scrollDetail == 0){
      return;
    }
    e.preventDefault();
    this.setIndex(e.scrollDetail > 0 ? this.index - 1 : this.index + 1);
  };
*/
  this.enableDisableIMG = function(name, disable){
    if (!this[name]){
      return;
    }
    this[name].src = disable ? this[name + 'SrcDisabled'] : this[name + 'Src'];
  };

  this.destroy = function(){
    this.button = null;
    this.scale = null;
    this.grab = null;
    this.hidden = null;
    this.plus = null;
    this.minus = null;
  };
};

jsx.require(['Dom', 'Events', 'ShortCuts',  'DragAndDrop', 'CallBacks'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.Slider'));