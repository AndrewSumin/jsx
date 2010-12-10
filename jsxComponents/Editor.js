jsx.Links.createLink({href: jsx.ConstructURL.construct('{jsxComponents}.Editor.style', 'css')});
jsx.Components.buildComponent('{jsxComponents}.Editor',
  function(){
    this.ACTIONS = ['Source', 'Editor', 'Bold', 'Italic', 'InsertUnorderedList', 'InsertOrderedList', 'Undo'];
    this.SHORTCUTS = [
      ['B', 'Bold'],
      ['I', 'Italic'],
      ['U', 'InsertUnorderedList'],
      ['O', 'InsertOrderedList']
    ];
    this.init = function(element, params){
      this.element = element;
      jsx.Dom.addClassName(this.element, 'jsxComponents-Editor');
      this.createTextarea();
      this.createActions(params.actions || this.ACTIONS);
      this.createFrame(this.textarea.getValue() || '');
      this.createShortcuts(params.shortcuts || this.SHORTCUTS, this.frame.getElement());
      
      jsx.CallBacks.add('jsxComponents-Editor-Action', jsx.bind(this, this.action), this.actions);
      jsx.CallBacks.add('jsxComponents-Editor-Action', jsx.bind(this, this.action), this.shortcuts);
      jsx.CallBacks.add('jsxComponents-Editor-ChangeHTML', jsx.bind(this, this.updateTextarea), this.frame);
      jsx.CallBacks.add('jsxComponents-Editor-ChangeHTML', jsx.bind(this, this.updateTextarea), this.element);
    };
    this.createTextarea = function(element){
      this.textarea = new jsxComponents.Editor.Textarea(jsx.Dom.getElementBySelector(this.element, 'textarea'));
      this.textarea.hide();
    };
    this.updateTextarea = function(value){
      this.textarea.setValue(value);
    };
    this.createFrame = function(){
      this.frame = new jsxComponents.Editor.Frame();
      this.element.appendChild(this.frame.getElement());
      this.frame.init(this.textarea.getValue() || '');
    };
    this.createActions = function (actions){
      this.actions = new jsxComponents.Editor.Actions(actions);
      this.element.insertBefore(this.actions.getElement(), this.textarea.getElement());
    };
    this.createShortcuts = function (shortcuts, frame){
      this.shortcuts = new jsxComponents.Editor.Shortcuts(shortcuts, frame);
    };
    this.action = function(action){
      switch (action) {
        case 'Source':
        case 'Editor':
          this.toggleSource();
          break;
        default:
          this.frame.execCom(action);
      }
    };
    this.toggleSource = function(){
      if (this.source){
        this.frame.setValue(this.textarea.getValue());
        this.frame.show();
        this.textarea.hide();
        jsx.Dom.removeClassName(this.element, 'jsxComponents-Editor-Source');
        this.source = false;
      }else{
        this.frame.hide();
        this.textarea.show();
        jsx.Dom.addClassName(this.element, 'jsxComponents-Editor-Source');
        this.source = true;
      }
    };
  },
  ['Dom', 'Events', 'CallBacks', '{jsxComponents}.Editor.Textarea', '{jsxComponents}.Editor.Frame', '{jsxComponents}.Editor.Actions', '{jsxComponents}.Editor.Shortcuts']
);
