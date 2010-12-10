jsx.require(['Dom', 'Events', 'CallBacks', 'ShortCuts', '{jsxComponents}.ScreenFade'],
  function (){
    jsxComponents.Gallery.Popup = new function(){
      this.fade = jsxComponents.ScreenFade;
      
      this.createElement = function(){
        this.element = document.createElement('div');
        jsx.Dom.addClassName(this.element, 'jsxComponents-Gallery-Popup');
        
        this.title = this.element.appendChild(document.createElement('div'));
        jsx.Dom.addClassName(this.title, 'jsxComponents-Gallery-Popup-Title');
        
        jsx.Events.observe(this.element, 'click', jsx.bind(this, this.next));
      };
      
      this.open = function(fotos){
        this.fotos = (jsx.isArray(fotos)) ? fotos : [fotos];
        this.fade.show(this.element);
        this.index = 0;
        this.showFoto(this.fotos[this.index]);
        this.listenToEscapeKey.start();
      };
      
      this.close = function(){
        this.fade.hide(this.element);
        this.listenToEscapeKey.start();
      };
      
      this.next = function(){
        this.showFoto(this.fotos[++this.index]);
      };
      
      this.showFoto = function(foto){
        if (!foto){
          this.close();
          return;
        }
        this.createImg(foto.href);
      };
      
      this.createImg = function(src){
        jsx.Dom.addClassName(this.element, 'jsxComponents-Gallery-Popup-Loading');
        if (this.foto){
          this.element.removeChild(this.foto);
        }
        this.foto = this.element.appendChild(document.createElement('img'));
        jsx.Dom.addClassName(this.foto, 'jsxComponents-Gallery-Popup-Foto');
        
        jsx.Events.observe(this.foto, 'load', jsx.bind(this, this.afterLoad));
        
        this.foto.src = src;
      };
      
      this.afterLoad = function(){
        this.foto.style.marginLeft = '-' + (this.foto.offsetWidth / 2) + 'px';
        jsx.Dom.removeClassName(this.element, 'jsxComponents-Gallery-Popup-Loading');
      };
      
      this.createElement();
      jsx.CallBacks.add('jsxComponents-Gallery-Popup-New', jsx.bind(this, this.open), jsxComponents.Gallery);
      jsx.CallBacks.add('jsxComponents-ScreenFade-Click', jsx.bind(this, this.close), this.fade);
      
      this.listenToEscapeKey = jsx.ShortCuts.down([{key: jsx.ShortCuts.ESC}], jsx.bind(this, this.close), document, false);
      this.listenToEscapeKey.stop();
    };
    jsx.loaded('{jsxComponents}.Gallery.Popup');
  }
);