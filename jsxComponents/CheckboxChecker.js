jsx.Components.buildComponent('{jsxComponents}.CheckboxChecker',
  function(){

    this.init = function(element, params){

      this.element = element;
      this.params = params;

      this.checkboxes = jsx.Dom.getElementsBySelector(this.element, 'input[type=checkbox]').filter(function(cbx) {return !jsx.Dom.hasClassName(cbx,'CheckboxChecker-Toggler')});
      this.toggler = jsx.Dom.getElementBySelector(this.element, '.CheckboxChecker-Toggler');

      this.checkboxes.forEach(jsx.bind(this, function(cbx){
        jsx.Events.observe(cbx, 'click', jsx.bind(this, this.clicked));
      }));
      jsx.Events.observe(this.toggler, 'click', jsx.bind(this, this.toggleAll));

    };

    this.toggleAll = function() {

      var state = this.toggler.checked;

      this.checkboxes.forEach(function(cbx){
        cbx.checked = state;
      });

    };

    this.clicked = function() {

      var count = 0;

      this.checkboxes.forEach(function(cbx){
        if (cbx.checked) {
          count++;
        }
      });

      if (count == this.checkboxes.length) {
        this.toggler.checked = true;
      } else {
        this.toggler.checked = false;
      }

    };


  },
  ['Dom', 'Events']
);
