jsx.Components.buildComponent('{ZC}.Textarea',
  function(){
    this.init = function(element, params){
      this.element = element;
      jsx.Dom.addClassName(this.element, 'zen-coding');
      
      for (var i in params){
        jsx.Dom.addClassName(this.element, 'zc-' + i + '-' + params[i]);
      }
    };
  },
  ['Dom', '{ZC}.zen_textarea']
);
