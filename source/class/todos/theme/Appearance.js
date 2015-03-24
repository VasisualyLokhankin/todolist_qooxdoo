/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
/**
 * * @asset(qx/icon/Tango/*
 */
qx.Theme.define("todos.theme.Appearance", {
  extend : qx.theme.simple.Appearance,
  appearances : {
    "todo-window" : {
      include : "window",
      alias : "window",
      style : function(){
        return {
          contentPadding: 0
        };
      }
    },
    "checkbox": {
      alias : "atom",
      style : function(states) {
        var icon;
        if (states.checked) {
          icon = "todos/checked.png";
        } else if (states.undetermined) {
          icon = qx.theme.simple.Image.URLS["todos/undetermined.png"];
        } else {
          icon = qx.theme.simple.Image.URLS["blank"];
        }

        return {
          icon: icon,
          gap: 8,
          cursor: "pointer"
        }
      }
    },
    "radiobutton": {
      style : function(states) {
        return {
          icon : null,
          font : states.checked ? "bold" : "default",
          textColor : states.checked ? "green" : "black",
          cursor: "pointer"
        }
      }
    },
    "checkbox/icon" : {
      style : function(states) {
        return {
          decorator : "checkbox",
          width : 16,
          height : 16,
          backgroundColor : "white"
        }
      }
    },
    "todo-window/checkbox" : "checkbox",
    "todo-window/textfield" : "textfield",
    "todo-window/todos-scroll" : "scrollarea",
    "todo-window/todo-writer" : {
      style : function() {
        return {
          padding   : [2, 2, 0, 0]
        };
      }
    },
    "todo-window/statusbar" : {
      style : function() {
        return {
          padding   : [ 2, 6],
          decorator : "statusbar",
          minHeight : 32,
          height : 32
        };
      }
    },
    "todo-window/statusbar/info" : "label",
    "todo-window/statusbar/rb-filter-all" : "radiobutton",
    "todo-window/statusbar/rb-filter-active" : "radiobutton",
    "todo-window/statusbar/rb-filter-completed" : "radiobutton",
    "todo-window/statusbar/remove-completed-button" : {
      include : "button",
      alias : "button",
      style : function() {
        return {
          width : 150,
          allowGrowX : false
        };
      }
    },
    "todo/label" : {
      include : "label",
      alias : "label",
      style : function(states) {
        return {
          font : (states.completed ? "line-through" : "default"),
          textColor : (states.completed ? "light-gray" : "black"),
          cursor : "text"
        };
      }
    },
    "todo/icon" : {
      style : function() {
        return {
          cursor : "pointer"
        };
      }
    },
    "todo/text-container" : {
      style : function() {
        return {
          allowGrowY : false
        };
      }
    },
    "todo/checkbox" : "checkbox"
  }
});