jsx.require(['Dom', 'Events', 'CallBacks'], function(){
  jsx.Links.createLink({href: jsx.ConstructURL.construct('{jsxComponents}.ScreenFade.style', 'css')});
  jsxComponents.ScreenFade = {
    init: function(){
      var body = document.getElementsByTagName('body')[0];
      this.frame = body.insertBefore(document.createElement('div'), body.firstChild);
      jsx.Dom.addClassName(this.frame, 'jsxComponents-ScreenFade-frame');
      jsx.Dom.addClassName(this.frame, 'jsxComponents-ScreenFade-hidden');

      this.createIframe();
      this.createShadow();
      this.createContainer();
    },

    createIframe: function(){
      if (!jsx.Vars.msie6) {
        return;
      }
      this.frame.innerHTML += '<iframe class="jsxComponents-ScreenFade-iframe"></iframe>';
    },

    createShadow: function() {
      var shadow = document.createElement('div');
      jsx.Events.observe(shadow, 'click', jsx.bind(this, this.dispatch));
      jsx.Dom.addClassName(shadow, 'jsxComponents-ScreenFade-shadow');
      this.frame.appendChild(shadow);
    },

    createContainer: function(){
      this.container = this.frame.appendChild(document.createElement('div'));
      jsx.Dom.addClassName(this.container, 'jsxComponents-ScreenFade-container');
    },

    createCloser: function(parent){
      if (!this.closer) {
        this.closer = parent.appendChild(document.createElement('div'));
        jsx.Dom.addClassName(this.closer, 'jsxComponents-ScreenFade-closer');
        jsx.Dom.addClassName(this.closer, 'b-popup-closer');
        this.closer.innerHTML = '<img src="' + jsx.ConstructURL.construct('{jsxComponents}.ScreenFade.close', 'gif') + '" alt="Закрыть" title="Закрыть"/>';
        jsx.Events.observe(this.closer, 'click', jsx.bind(this, this.dispatch));
      }else{
        parent.appendChild(this.closer);
      }
    },

    dispatch: function() {
      if (this.autoclose){
        this.hide();
      }
      jsx.CallBacks.dispatch('jsxComponents-ScreenFade-Click', this);
    },

    show: function(child, autoclose){
      this.clear();
      if (child){
        this.child = this.container.appendChild(child);
        jsx.Dom.addClassName(this.child, 'jsxComponents-ScreenFade-child');
        this.setPosition();
        this.createCloser(child);
      }
      jsx.Dom.removeClassName(this.frame, 'jsxComponents-ScreenFade-hidden');
      this.autoclose = autoclose;
    },

    hide: function(){
      jsx.Dom.addClassName(this.frame, 'jsxComponents-ScreenFade-hidden');
      this.clear();
    },

    clear: function(){
      if (this.child && this.child.parentNode) {
        this.child.parentNode.removeChild(this.child);
        this.child = false;
      }
    },

    setPosition: function() {
      if (!this.child) {
        return;
      }

      this.child.style.top = (jsx.Dom.getScroll().top + 40) + 'px';

      this.frame.style.height = (document.body.clientHeight + jsx.Dom.getScrollBox().height) + 'px';
      //this.frame.style.width = (document.body.clientWidth + jsx.Dom.getScrollBox().width) + 'px';
    }
  };
  jsxComponents.ScreenFade.init();
  jsx.loaded('{jsxComponents}.ScreenFade');
});