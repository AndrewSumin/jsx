/**
 * Object for one listener for keys. Last argument says whether to listen for short cuts on form fields or not.
 * First argument hash mask for keys like [{key: jsx.ShortCut.ESC}, {code: 'a'}].
 * @alias jsx.ShortCutsListener
 * @param {Object} Hash mask like [{key: jsx.ShortCuts.ESC}, {code: 'a'}].
 * @param {Function} Listener.
 * @param {Object} DOM node.
 * @param {Object} Listen short cuts on form fields or not.
 */
jsx.ShortCutsListener = function (masks, listener, object, check_target){
  this.masks = masks;
  this.object = object;
  this.listener = listener;
  this.check_target = check_target;
  this.last_result = false;

  this.start();
};

jsx.ShortCutsListener.prototype = {
  // Public


  /**
   * Starts listen key.
   * @alias jsx.ShortCutsListener.start
   */
  start: function(){
    this.enable(true);
  },

  /**
   * Stops listen key.
   * @alias jsx.ShortCutsListener.stop
   */
  stop: function(){
    this.enable(false);
  },

  /**
   * Checks key for listening.
   * @alias jsx.ShortCutsListener.isEnable
   */
  isEnable: function(){
    return this.enabled;
  },

  /**
   * Enables or disable listening.
   * @alias jsx.ShortCutsListener.enable
   * @param {Boolean} Enable or disable.
   */
  enable: function(enabled){
    this.enabled = enabled;
  },

  // Private

  _check: function(mask, is_input, elem, e){
    if (!this.isEnable()) {
      return false;
    }

    if (this.check_target && is_input) {
      return false;
    }
    
    if (this.object != document && this.object != elem) {
      return false;
    }

    if (this._checkMask(mask, e)) {
      this.last_result = true;

      var _this = this;

      function run()
      {
        _this.listener(e);
      }

      window.setTimeout(run, 0);
    } else {
      this.last_result = false;
    }

    return this.last_result;
  },

  _checkMask: function(mask, e){
    for (var i = 0, l = this.masks.length; i < l; i++) {
      var m = this.masks[i];

      if (m == mask) {
        return true;
      }

      // for blocker
      if (m === 0) {
        // alphanum
        if ((e.keyCode > 48 && e.keyCode < 112) && !e.ctrlKey && !e.altKey && (typeof e.metaKey != 'undefined' && !e.metaKey)) {
          return true;
        }
      }
    }

    return false;
  }
};

/**
 * Allow to make shortcuts.
 * Have links to key codes:
 * <pre>
 *   F1  (112)  BACKSPACE (8)   END          (35)  PLUS_NUM    (107)
 *   F2  (113)  TAB       (9)   HOME         (36)  MINUS       (109)
 *   F3  (114)  ENTER     (13)  LEFT_ARROW   (37)  MINUS_NUM   (109)
 *   F4  (115)  SHIFT     (16)  UP_ARROW     (38)  NUM_1       (49)
 *   F5  (116)  CTRL      (17)  RIGHT_ARROW  (39)  NUM_LOCK    (144)
 *   F6  (117)  ALT       (18)  DOWN_ARROW   (40)  SCROLL_LOCK (145)
 *   F7  (118)  PAUSE     (19)  INSERT       (45)  SLASH       (191)
 *   F8  (119)  CAPS_LOCK (20)  DELETE       (46)  ASTERISK    (106)
 *   F9  (120)  ESC       (27)  PLUS         (61)
 *   F10 (121)  SPACE     (32)  LEFT_WINDOW  (91)
 *   F11 (122)  PAGE_UP   (33)  RIGHT_WINDOW (92)
 *   F12 (123)  PAGE_DOWN (34)  SELECT       (93)
 * </pre>
 * @alias jsx.ShortCuts
 */
jsx.ShortCuts = new function(){
  var maskUnicode = 1 << 16;
  var maskCode = maskUnicode - 1;
  var maskCtrl = maskUnicode;
  var maskAlt = maskCtrl << 1;
  var maskShift = maskAlt << 1;

  this.BACKSPACE = 8;
  this.TAB = 9;
  this.ENTER = 13;
  this.SHIFT = 16;
  this.CTRL = 17;
  this.ALT = 18;
  this.PAUSE= 19;
  this.CAPS_LOCK = 20;
  this.ESC = 27;
  this.SPACE = 32;
  this.PAGE_UP = 33;
  this.PAGE_DOWN = 34;
  this.END = 35;
  this.HOME = 36;
  this.LEFT_ARROW = 37;
  this.UP_ARROW = 38;
  this.RIGHT_ARROW = 39;
  this.DOWN_ARROW = 40;
  this.INSERT = 45;
  this.DELETE = 46;
  this.PLUS = 61;
  this.LEFT_WINDOW = 91;
  this.RIGHT_WINDOW = 92;
  this.SELECT = 93;
  this.PLUS_NUM = 107;
  this.MINUS = 109;
  this.MINUS_NUM = 109;
  this.NUM_1 = 49;
  this.F1 = 112;
  this.F2 = 113;
  this.F3 = 114;
  this.F4 = 115;
  this.F5 = 116;
  this.F6 = 117;
  this.F7 = 118;
  this.F8 = 119;
  this.F9 = 120;
  this.F10 = 121;
  this.F11 = 122;
  this.F12 = 123;
  this.NUM_LOCK = 144;
  this.SCROLL_LOCK = 145;

  this.SLASH = 191;
  this.ASTERISK = 106;
  
  this.KEY_B = 66;
  this.KEY_U = 85;
  this.KEY_I = 73;
  this.KEY_O = 79;

  /// Private

  this.typeDown = 1;
  this.typePress = 2;

  this.listDown = [];
  this.listPress = [];

  this._blocker = null;

  this._getMask = function(set, type){
    var code = 0, mask;

    if (set.key) {
      code = set.key;
    } else if (set.ch) {
      switch (type){
        case this.typeDown:
          code = set.ch.toUpperCase();
          break;

        case this.typePress:
          code = set.ch.toLowerCase();
          break;
      }
      code = code.charCodeAt(0);
    }

    mask = maskCode & code;

    if (set.ctrl) {
      mask ^= maskCtrl;
    }
    
    if (set.alt) {
      mask ^= maskAlt;
    }

    if (set.shift) {
      mask ^= maskShift;
    }
    return mask;
  };

  this._getMasks = function(keys, type){
    var len = keys.length;
    var masks = [];

    for (var i = 0; i < len; i++) {
      masks[i] = this._getMask(keys[i], type);
    }
    
    return masks;
  };

  this._getMaskEvent = function(e, type){
    switch (type)
    {
      case this.typeDown:
        return this._getMask(this._getSet(e.keyCode, e));

      case this.typePress:
        var key = e.charCode ? e.charCode : e.keyCode;
        return this._getMask(this._getSet(key, e));
    }
    return 0;
  };

  this._getSet = function(key, e){
    return {key: key, ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey};
  };

  this._isInputTarget = function(elem){
    if (!elem.tagName) {
      return false;
    }

    switch (elem.tagName.toLowerCase()){
      case 'input': {
        switch (elem.type) {
          case 'text': case 'password': case 'file': case 'search':
            return true;
        }
        break;
      }
      case 'textarea': {
        return true;
      }
    }

    return false;
  };

  this._keyListener = function(e, type, list){
    var elem = jsx.Events.element(e);
    var mask = this._getMaskEvent(e, type);
    var is_input = this._isInputTarget(elem);

    var res = false;
    for (var i = 0, l = list.length; i < l; i++) {
      res = list[i]._check(mask, is_input, elem, e) || res;
    }
    return res;
  };

  this.keyDownListener = function(e){
    return this._keyListener(e, this.typeDown, this.listDown);
  };

  this.keyPressListener = function(e){
    return this._keyListener(e, this.typePress, this.listPress);
  };

  this._action = function(type, list, keys, listener, object, check_target){
    if (typeof(check_target) == 'undefined') {
      check_target = true;
    }
    return (list[list.length] = new jsx.ShortCutsListener(this._getMasks(keys, type), listener, object || document, check_target));
  };

  var _this = this;
  var is_down = false;

  if (jsx.Vars.msie) {

    this.MINUS = 189;
    this.PLUS  = 187;

    function keyPressListenerI(e){
      if (!is_down) {
        is_down = _this.keyDownListener(e);
        
        if (is_down) {
          jsx.Events.stop(e);
          _this.keyUpEventListener.start();
        }
      }

      _this.keyPressListener(e);
    }

    function keyUpListenerI(e){
      is_down = false;
      _this.keyUpEventListener.stop();
    }
    this.init = function(doc){
      this.keyPressEventListener = jsx.Events.observe(doc,'keydown', keyPressListenerI, false, true);
      this.keyUpEventListener = jsx.Events.observe(doc, 'keyup', keyUpListenerI, false, false);
    }

  } else {

    function keyDownListener(e){
      is_down = _this.keyDownListener(e);

      if (is_down) {
        jsx.Events.stop(e);
        _this.keyDownEventListener.stop();
        _this.keyUpEventListener.start();
      }
    }

    function keyPressListener(e){
      _this.keyPressListener(e);

      if (is_down) {
        jsx.Events.stop(e);
      }
    }

    function keyUpListener(e){
      _this.keyUpEventListener.stop();
      _this.keyDownEventListener.start();
      is_down = false;
    }

    this.init = function(doc){
      this.keyDownEventListener = jsx.Events.observe (doc, 'keydown', keyDownListener, false, true);
      this.keyPressEventListener = jsx.Events.observe (doc, 'keypress', keyPressListener, false, true);
      this.keyUpEventListener = jsx.Events.observe (doc, 'keyup', keyUpListener, false, false);
    }
  }

  /// Public
  /**
   * Listens for key down.
   * @alias jsx.ShortCut.down
   * @param {Object} Hash mask like [{key: jsx.ShortCut.ESC, ctrl: bool, alt: bool, shift: bool}, {code: 'a'}].
   * @param {Function} Listener.
   * @param {Object} DOM node.
   * @param {Object} Listen short cuts on form fields or not.
   * @return {Object} jsx.ShortCutsListener
   */
  this.down = function(keys, listener, object, check_target){
    return this._action(this.typeDown, this.listDown, keys, listener, object, check_target);
  };

  /**
   * Listens for key press.
   * @alias jsx.ShortCut.press
   * @param {Object} Hash mask like [{key: jsx.ShortCut.ESC, ctrl: bool, alt: bool, shift: bool}, {code: 'a'}].
   * @param {Function} Listener.
   * @param {Object} DOM node.
   * @param {Object} Listen short cuts on form fields or not.
   * @return {Object} jsx.ShortCutsListener
   */
  this.press = function(keys, listener, object, check_target){
    return this._action(this.typePress, this.listPress, keys, listener, object, check_target);
  };

  /**
   * Blocks listening.
   * @alias jsx.ShortCut.block
   */
  this.block = function(){
    this._blocker.start();
  };

  /**
   * Unblocks listening.
   * @alias jsx.ShortCut.unblock
   */
  this.unblock = function(){
    this._blocker.stop();
  };

  this._blocker = this.down([{}], jsx.Vars.EMPTY);
};

jsx.require(['Events'], function (){jsx.ShortCuts.init(document); jsx.loaded('ShortCuts');});