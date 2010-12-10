jsx.Components.buildComponent('{jsxComponents}.Gallery',
  function(){
    jsx.Links.createLink({href: jsx.ConstructURL.construct('{jsxComponents}.Gallery.style', 'css')});
    this.init = function(element){
      jsx.Console.log('Gallery initialized on ', element, ['Gallery']);
      //jsx.Events.observe(element, 'click', jsx.bind(this, this.onClick));
      jsx.Dom.getElementsBySelector(this.element, '.jsxComponents-Gallery-Item').forEach(jsx.bind(this, this.createItem));
      
      this.openById(jsx.Location.getHash());
    };
    
    this.createItem = function(item){
      jsx.Events.observe(jsx.Dom.getElementBySelector(item, '.jsxComponents-Gallery-Item-Img'), 'click', jsx.bind(this, this.onClick, item));
    };

    this.onClick = function(item, e) {
      jsx.Events.stop(e);
      jsx.Console.log('Clicked on ', item, ['Gallery']);
      this.openPopup(jsx.Dom.getElementsBySelector(item, '.jsxComponents-Gallery-Item-Link'));
    };
    
    this.openById = function(id){
      var item = document.getElementById(id);
      if (!item || !jsx.Dom.hasClassName(item, 'jsxComponents-Gallery-Item')){
        return;
      }
      this.openPopup(jsx.Dom.getElementsBySelector(item, '.jsxComponents-Gallery-Item-Link'));
    };
    

    this.openPopup = function(params) {
      jsx.Console.log('Opening popup with ', params, ['Gallery']);
      jsx.CallBacks.dispatch('jsxComponents-Gallery-Popup-New', jsxComponents.Gallery, params);
    };
    
  },
  ['Dom', 'Events', 'CallBacks', '{jsxComponents}.Gallery.Popup', 'Location']
);