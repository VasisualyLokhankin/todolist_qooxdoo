/**
 * @asset(todos/*)
 */
qx.Class.define("todos.Application", {
  extend : qx.application.Standalone,
  members : {
    main : function() {
      // Call super class
      this.base(arguments);

      var wnd = new todos.Window;
      wnd.show();
    }
  }
});
