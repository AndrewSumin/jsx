jsx.Validation = {
  regexpEmail: /[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-z]{2,7}/i,
  trimRegexp: /(^[\s\xA0]+|[\s\xA0]+$)/g,
  digitsRegexp: /\d+/,
  isEmpty: function(data){
    if (typeof data == 'string'){
      return this.isEmptyString(data);
    }else if (data.tagName.toLowerCase() == 'input' || data.tagName.toLowerCase() == 'textarea'){
      return this.isEmptyInput(data);
    }else if (data.tagName.toLowerCase() == 'select'){
      return this.isEmptySelect(data);
    }
  },
  isEmptyString: function(string){
    return string.replace(this.trimRegexp, '') == '';
  },
  isEmptyInput: function(input){
    return this.isEmptyString(input.value);
  },
  isEmptySelect: function(select){
    return select.selectedIndex == 0;
  },  
  isEmail: function(string){
    return this.regexpEmail.test(string);
  }
};
jsx.loaded('Validation');
