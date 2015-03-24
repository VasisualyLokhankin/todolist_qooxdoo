qx.Class.define("todos.Window", {
  extend: qx.ui.window.Window,

  properties: {
    appearance: {
      refine: true,
      init: "todo-window"
    },

    todos: {
      init: [],
      check: "Array",
      event: "todosChanged"
    },

    filter: {
      init: "all",
      check: ["all", "active", "completed"],
      apply: "__applyFilter"
    }
  },

  construct: function(){
    this.base(arguments);

    this.set({
      caption: "todos",
      width: 480,
      height: 640,
      allowMinimize: false,
      allowMaximize: false,
      allowClose: false
    });

    this.setLayout(new qx.ui.layout.VBox(2));
    this.add(this.getChildControl("todo-writer"));
    this.add(this.getChildControl("todos-scroll"), {flex: 1});
    this.add(this.getChildControl("statusbar"));

    this.addListenerOnce("appear", function(){
      this.center();
    }, this);
  },

  destruct : function() {
    var todoItems = this.getTodos();
    for (var i= 0, l=todoItems.length; i<l; i++) {
      todoItems[i].dispose();
    }
  },

  members : {
    // overridden
    _createChildControlImpl: function(id) {
      var control;

      switch(id) {
        case "todo-writer":
          var grid = new qx.ui.layout.Grid;
          grid.setColumnWidth(0, 20);
          grid.setColumnFlex(1, 1);
          grid.setColumnAlign(0, "center", "middle");
          grid.setColumnAlign(1, "left", "middle");
          control = new qx.ui.container.Composite(grid);
          control.add(this.getChildControl("checkbox"), {row: 0, column: 0});
          control.add(this.getChildControl("textfield"), {row: 0, column: 1});
          break;
        case "checkbox":
          control = new qx.ui.form.CheckBox;
          control.addListener("changeValue", this.__onCheckAllChanged, this);
          break;
        case "textfield":
          control = new qx.ui.form.TextField;
          control.setPlaceholder("What needs to be done?");
          control.addListener("keydown", this.__onWriterTextFieldKeydown, this);
          break;
        case "todos-scroll":
          control = new qx.ui.container.Scroll;
          control.add(this.getChildControl("todos-container"));
          break;
        case "todos-container":
          control = new qx.ui.container.Composite(new qx.ui.layout.VBox(1));
          break;
        case "statusbar":
          control = new todos.StatusBar;
          control.bind("filter", this, "filter");
          this.bind("todos", control, "todos");
          control.addListener("removeCompleted", this.__onRemoveCompleted, this);
          break;
      }
      return control || this.base(arguments, id);
    },

    __onWriterTextFieldKeydown : function(event) {
      var key = event.getKeyIdentifier();
      switch(key) {
        case "Enter":
          var value = event.getTarget().getValue();
          if (value) {
            event.getTarget().setValue("");
            var todo = new todos.ToDo(value);
            this.getTodos().push(todo);
            todo.addListenerOnce("remove", this.__onTodoRemove, this);
            todo.addListener("completedChanged", this.__onTodoCompletedChanged, this);

            this.__updateTodoList();
            this.getChildControl("statusbar").update();

            var cbAll = this.getChildControl("checkbox");
            cbAll.removeListener("changeValue", this.__onCheckAllChanged, this);
            cbAll.setValue(false);
            cbAll.addListener("changeValue", this.__onCheckAllChanged, this);
          }
          break;
        case "Escape":
          event.getTarget().setValue("");
          break;
      }
    },

    __updateTodoList : function() {
      var toList;
      switch(this.getFilter()) {
        case "all":
          toList = this.getTodos();
          break;
        case "active":
          toList = this.getTodos().filter(function(item){return !item.getCompleted();});
          break;
        case "completed":
          toList = this.getTodos().filter(function(item){return item.getCompleted();});
          break;
      }
      var container = this.getChildControl("todos-container");
      container.removeAll();
      toList.forEach(function(item){
        container.add(item);
      });
    },

    __applyFilter : function() {
      this.__updateTodoList();
    },

    __onTodoRemove : function(event) {
      var todo = event.getTarget();
      this.setTodos(this.getTodos().filter(function(item){return item !== todo;}));
      this.getChildControl("todos-container").remove(todo);
      todo.dispose();
      this.getChildControl("statusbar").update();
    },

    __onTodoCompletedChanged : function() {
      var cbAll = this.getChildControl("checkbox");
      cbAll.removeListener("changeValue", this.__onCheckAllChanged, this);
      cbAll.setValue(this.getTodos().length === this.getTodos().filter(function(item){return item.getCompleted();}).length);
      cbAll.addListener("changeValue", this.__onCheckAllChanged, this);
      this.__updateTodoList();
      this.getChildControl("statusbar").update();
    },

    __onCheckAllChanged : function(event) {
      var value = event.getData();
      this.getTodos().forEach(function(todo){
        todo.removeListener("completedChanged", this.__onTodoCompletedChanged, this);
        todo.setCompleted(value);
        todo.addListener("completedChanged", this.__onTodoCompletedChanged, this);
      }, this);
      this.__updateTodoList();
      this.getChildControl("statusbar").update();
    },

    __onRemoveCompleted : function() {
      var completed = this.getTodos().filter(function(item){return item.getCompleted();});
      this.setTodos(this.getTodos().filter(function(item){return !item.getCompleted();}));
      completed.forEach(function(todo){
        this.getChildControl("todos-container").remove(todo);
        todo.dispose();
      }, this);
      this.getChildControl("statusbar").update();
      this.getChildControl("checkbox").setValue(false);
    }
  }
});
