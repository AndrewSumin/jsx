jsxComponents.AutoComplete.LocalDataProccess = function(data){
  this.setData(data);
  this.proccess = new jsxComponents.AutoComplete.DataProccess();
};
jsxComponents.AutoComplete.LocalDataProccess.prototype = new function(){
  this.setData = function(data){
    this.string = data;
  };
  this.filter = function(string, callback){
    var result = string.length ? this.proccess.match(this.string, string, null): null;
    callback(result ? result.map(jsx.bind(this.proccess, this.proccess.createDataForNode)) : null);
  };
  this.getOne = function(string){
    var node = this.proccess.match(this.string, string, 'full');
    return this.proccess.createDataForNode(node[0]);
  };
};

jsx.require(['{jsxComponents}.AutoComplete.DataProccess'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.AutoComplete.LocalDataProccess'));