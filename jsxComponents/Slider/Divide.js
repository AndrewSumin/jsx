jsx.require(['{jsxComponents}.Slider'], function(){
  jsx.Components.buildComponent('{jsxComponents}.Slider.Divide',
  function(){
    this.init = function(element){
      this.element = element;
      this.left = jsx.Dom.getElementBySelector(this.element, '.jsxComponents-Slider-Divide-Left');
      this.right = jsx.Dom.getElementBySelector(this.element, '.jsxComponents-Slider-Divide-Right');
      
      jsx.CallBacks.add('jsxComponents-Slider-Move', jsx.bind(this, this.show),  this.element);
      jsx.CallBacks.dispatch('jsxComponents-Slider-DispatchStatus', this.element);
    };
    this.show = function(slider){
      this.left.innerHTML = slider.value;
      this.right.innerHTML = slider.range[1] - slider.value;
      //console.log(slider)
    };
  },
  ['Dom', 'CallBacks']
)});