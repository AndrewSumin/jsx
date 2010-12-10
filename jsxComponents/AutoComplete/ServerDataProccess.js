jsxComponents.AutoComplete.ServerDataProccess = function(params){
  this.init(params);
};
jsxComponents.AutoComplete.ServerDataProccess.prototype = new function(){
  this.init = function(params){
    this.server = this.getURL(params.server, params.key);
    this.id = params.id || null;
    this.proccess = new jsxComponents.AutoComplete.DataProccess();
  };
  this.getURL = function(url, key){
    var delim = url.indexOf('?') == -1
      ? '?'
      : url.lastIndexOf('?') == url.length - 1
        ? ''
        : url.lastIndexOf('&') == url.length - 1
          ? ''
          : '&';
    return url + delim + key + '=';
  };
  this.filter = function(string, callback){
    string = jsx.Strings.trim(string);
    if (this.ajax){
      this.ajax.abort();
    }
    if (string == ''){
      callback(null);
      return;
    };
    this.ajax = new jsxAjax.Common(
      new jsxAjax.JS(this.id),
      this.server + string,
      jsx.bind(this, this.onload, callback),
      jsx.Vars.EMPTY
    ).send();
  };
  this.onload = function(callback, string){
    this.string = string;
    var nodesData = this.proccess.match(string, '', 'split');
    callback(nodesData ? nodesData.map(jsx.bind(this.proccess, this.proccess.createDataForNode)) : null);
  };
  this.getOne = function(string){
    var node = this.proccess.match(this.string, string, 'full');
    return this.proccess.createDataForNode(node[0]);
  };
};
jsx.require(['{jsxComponents}.AutoComplete.DataProccess', '{jsxAjax}.Common', '{jsxAjax}.JS'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.AutoComplete.ServerDataProccess'));