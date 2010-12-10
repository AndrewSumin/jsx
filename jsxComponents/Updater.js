jsx.Components.buildComponent('{jsxComponents}.Updater',
  function(){
    this.init = function(element, params){
      this.element = element;
      this.params = params;
      this.params.update = params.update || 'once';
      this.trigger = jsx.Dom.getElementBySelector(element, '.jsxComponents-Updater-Trigger');
      this.target = jsx.Dom.getElementBySelector(element, '.jsxComponents-Updater-Target');
      this.updated = 0;
      this.method = 'get';
      this.requestParams = {};
      jsx.Events.observe(this.trigger,'click',jsx.bind(this,this.doUpdate));
    };

    this.doUpdate = function() {

      if (this.params.update == 'once' && this.updated) {
        // already updated, do nothing
      } else {
        jsx.Dom.removeClassName(this.target, 'jsxComponents-Updater-Updated');
        jsx.Dom.addClassName(this.target, 'jsxComponents-Updater-Updated');
        new jsxAjax.XmlHttp.Request(this.params.url, {
          method: this.method,
          parameters: this.requestParams,
          onSuccess: jsx.bind(this,this.onSuccess),
          onFailure: jsx.bind(this,this.onFailure)
        });
      }
    };

    this.onSuccess = function(transport){
      jsx.Dom.removeClassName(this.target, 'jsxComponents-Updater-Updating');
      jsx.Dom.addClassName(this.target, 'jsxComponents-Updater-Updated');
      this.target.innerHTML = transport.responseText;
      this.updated++;
    };

    this.onFailure = function(transport){
      jsx.Dom.removeClassName(this.target, 'jsxComponents-Updater-Updating');
      this.target.innerHTML = this.params.error || 'Произошла ошибка.';
      this.updated = 0;
    };

  },
  ['Dom', 'Events', '{jsxAjax}.XmlHttp']
);

