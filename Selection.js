/**
 * Converts selection in different browsers to one structure, most similar to Gecko.
 * @alias jsx.Selection
 * @return {Object} Selection in Geko structure.
 */
jsx.Selection = function(){
    if (typeof(window.getSelection) == 'function'){
        return window.getSelection();
    }else if(document.selection){
        return jsx.Selection.covertFromIE(document.selection);
    }
    return y5.Selection.NULL;
};

/**
 * Converts IE selection.
 * @alias jsx.Selection.covertForIE
 * @return {Object} Selection in Geko structure.
 */
jsx.Selection.convertFromIE = function(selection){
    selection.selectAllChildren = function(object){
        var range = document.body.createTextRange();
        range.moveToElementText(object);
        range.select();
    };
    return selection;
};

/**
 * Empty object for bad browsers.
 * @alias jsx.Selection.NULL
 * @return {Object} Selection with empty structure.
 */
jsx.Selection.NULL = {
    selectAllChildren: jsx.Vars.NULL
};

jsx.SelectionInput = function(input){
  this.input = input;
};

jsx.SelectionInput.prototype = {
  del: function(){
    if (this.input.createTextRange){
      this.ieDel();
    }else{
      this.notieDel();
    }
  },
  ieDel:function(){
    var range = this.input.createTextRange();
    this.input.value = this.input.value.substr(0, this.input.value.length - 1);
  },
  notieDel:function(){
    var value = this.input.value;
    var start = this.input.selectionStart;
    var end = this.input.selectionEnd;
    if (start == end){
      start = start - 1;
    }
    var length = end - start;
    this.input.value = jsx.Strings.cut(value, start, length);
    this.input.setSelectionRange(start, start);
    this.setCursor();
  },
  insert:function(string){
    if (this.input.createTextRange){
      this.ieInsert(string);
    }else{
      this.notieInsert(string);
    }
  },
  ieInsert:function(string){
    this.input.value += string;
  },
  notieInsert:function(string){
    var start = this.input.selectionStart;
    var end = this.input.selectionEnd;
    if (start != end) {
      this.del();
    }
    var value = this.input.value;
    this.input.value = value.substr(0, start) + string + value.substr(start);
    this.input.setSelectionRange(start + string.length, start + string.length);
    this.setCursor();
  },
  setCursor: function(){
    this.input.focus();

    var evt = document.createEvent("KeyboardEvent");
    evt.initKeyEvent("keypress", true, true, null, false, false, false, false, 27, 0);
    this.input.dispatchEvent(evt);
  },
  select:function(){
    this.input.select();
  }
};

jsx.require(['Dom', 'Strings'], jsx.bind(jsx, jsx.loaded, 'Selection'));
