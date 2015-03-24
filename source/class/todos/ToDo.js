qx.Class.define("todos.ToDo", {
  extend: qx.ui.core.Widget,

  events : {
    remove : "qx.event.type.Event"
  },

  properties : {
    completed : {
      init : false,
      check : "Boolean",
      event : "completedChanged",
      apply : "__applyCompleted"
    },

    appearance : {
      refine : true,
      init : "todo"
    }
  },

  construct: function(text){
    this.base(arguments);

    var grid = new qx.ui.layout.Grid(3,0);
    grid.setColumnWidth(0, 20);
    grid.setColumnFlex(1, 1);
    grid.setColumnWidth(2, 20);
    grid.setColumnAlign(0, "center", "middle");
    grid.setColumnAlign(1, "left", "middle");
    grid.setColumnAlign(2, "center", "middle");
    grid.setRowHeight(0, 24);

    this._setLayout(grid);
    this._add(this.getChildControl("checkbox"), {row: 0, column: 0});
    this._add(this.getChildControl("text-container"), {row: 0, column: 1});
    this._add(this.getChildControl("icon"), {row: 0, column: 2});

    this.getChildControl("label").setValue(text);

    this.addListener("mouseover", function(){this.getChildControl("icon").show();}, this);
    this.addListener("mouseout", function(){this.getChildControl("icon").hide();}, this);
    this.getChildControl("icon").hide();

    this.getChildControl("text-container").addListener("dblclick", this.__editToDo, this);
  },

  members : {

    // overridden
    _createChildControlImpl: function(id) {
      var control;

      switch(id) {
        case "checkbox":
          control = new qx.ui.form.CheckBox;
          this.bind("completed", control, "value");
          control.bind("value", this, "completed");
          break;
        case "text-container":
          control = new qx.ui.container.Composite(new qx.ui.layout.HBox);
          control.add(this.getChildControl("label"), {flex: 1});
          break;
        case "label":
          control = new qx.ui.basic.Label;
          control.bind("value", control, "toolTipText");
          break;
        case "textfield":
          control = new qx.ui.form.TextField;
          control.addListener("keypress", function(event){
            var key = event.getKeyIdentifier();
            switch(key) {
              case "Enter":
                this.__editComplete();
                break;
              case "Escape":
                this.__editCancel();
                break;
            }
          }, this);
          control.addListener("blur", this.__editComplete, this);
          break;
        case "icon":
          control = new qx.ui.basic.Image("todos/icon-remove-circle.png");
          control.addListener("click", function(){
            this.fireEvent("remove");
          }, this);
          break;
      }
      return control || this.base(arguments, id);
    },

    __editToDo : function() {
      var tc = this.getChildControl("text-container");
      var tf = this.getChildControl("textfield");
      tc.removeAll();
      tc.add(tf, {flex: 1});
      tf.setValue(this.getChildControl("label").getValue());
      tf.focus();
      tf.activate();
    },

    __editComplete : function() {
      this.getChildControl("label").setValue(this.getChildControl("textfield").getValue());
      this.__editCancel();
    },

    __editCancel : function() {
      var tc = this.getChildControl("text-container");
      tc.removeAll();
      tc.add(this.getChildControl("label"), {flex: 1});
    },

    __applyCompleted : function(value) {
      if (value) {
        this.getChildControl("label").addState("completed");
      } else {
        this.getChildControl("label").removeState("completed");
      }
    }
  }
});
