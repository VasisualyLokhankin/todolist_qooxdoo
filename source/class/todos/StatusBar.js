qx.Class.define("todos.StatusBar", {
  extend: qx.ui.core.Widget,

  events: {
    removeCompleted: "qx.event.type.Event"
  },

  properties: {
    todos: {
      init: [],
      check: "Array"
    },

    filter: {
      init: "all",
      check: ["all", "active", "completed"],
      event: "filterChanged"
    }
  },

  construct: function() {
    this.base(arguments);

    var grid = new qx.ui.layout.Grid(10);
    grid.setColumnWidth(0, 100);
    grid.setColumnFlex(2, 1);
    grid.setColumnAlign(0, "left", "middle");
    grid.setColumnAlign(1, "center", "middle");
    grid.setColumnAlign(2, "right", "middle");
    grid.setRowHeight(0, 26);

    this._setLayout(grid);
    this._add(this.getChildControl("info"), {row: 0, column: 0});
    this._add(this.getChildControl("filter"), {row: 0, column: 1});
    this._add(this.getChildControl("remove-completed-button"), {row: 0, column: 2});
    this.update();
  },

  destruct: function() {
    this.__rgFilter.dispose();
  },

  members : {
    __rgFilter: null,

    update: function() {
      var todosCount = this.getTodos().length;
      var itemsLeft = this.getTodos().filter(function(item){return !item.getCompleted();}).length;
      this.getChildControl("info").setValue("<b>"+itemsLeft+"</b> items left");
      if (itemsLeft === todosCount) {
        this.getChildControl("remove-completed-button").exclude();
      } else {
        this.getChildControl("remove-completed-button").setLabel("Clear completed ("+(todosCount-itemsLeft)+")");
        this.getChildControl("remove-completed-button").show();
      }
    },

    // overridden
    _createChildControlImpl: function(id) {
      var control;

      switch(id) {
        case "info":
          control = new qx.ui.basic.Label;
          control.setRich(true);
          break;
        case "filter":
          control = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
          control.add(this.getChildControl("rb-filter-all"));
          control.add(this.getChildControl("rb-filter-active"));
          control.add(this.getChildControl("rb-filter-completed"));
          this.__rgFilter = new qx.ui.form.RadioGroup(
            this.getChildControl("rb-filter-all"),
            this.getChildControl("rb-filter-active"),
            this.getChildControl("rb-filter-completed")
          );
          this.__rgFilter.addListener("changeSelection", this.__onFilterChanged, this);
          break;
        case "rb-filter-all":
          control = new qx.ui.form.RadioButton("All");
          control.setUserData("value", "all");
          break;
        case "rb-filter-active":
          control = new qx.ui.form.RadioButton("Active");
          control.setUserData("value", "active");
          break;
        case "rb-filter-completed":
          control = new qx.ui.form.RadioButton("Completed");
          control.setUserData("value", "completed");
          break;
        case "remove-completed-button":
          control = new qx.ui.form.Button;
          control.addListener("execute", function(){
            this.fireEvent("removeCompleted");
          }, this);
          break;
      }
      return control || this.base(arguments, id);
    },

    __onFilterChanged : function(event) {
      this.setFilter(event.getData()[0].getUserData("value"));
    }
  }
});

