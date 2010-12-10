jsxComponents.AutoComplete.Loader = {
  dataSources: {},
  load: function(src, id, callback){
    if (typeof this.dataSources[src] == 'undefined'){
      this.dataSources[src] = {data: null, ready: false, callbacks:[callback]};
      this._load(src, id);
    }else if (this.dataSources[src].ready){
      callback(this.dataSources[src]);
    }else{
      this.dataSources[src].callbacks.push(callback);      
    }
  },
  _load: function(src, id){
    new jsxAjax.Common(
      new jsxAjax.JS(id),
      src,
      jsx.bind(this, this.onload, src),
      jsx.Vars.EMPTY
    ).send();
  },
  onload: function(src, data){
    this.dataSources[src].data = data;
    this.dataSources[src].ready = true;
    this.execCallbacks(src);
  },
  execCallbacks: function(src){
    var callback;
    while ((callback = this.dataSources[src].callbacks.shift())){
      callback(this.dataSources[src].data);
    }
  }
};

jsx.require(['{jsxAjax}.Common', '{jsxAjax}.JS'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.AutoComplete.Loader'));