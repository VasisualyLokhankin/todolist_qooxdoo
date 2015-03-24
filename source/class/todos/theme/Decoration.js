/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define("todos.theme.Decoration", {
  extend : qx.theme.simple.Decoration,

  decorations : {
    "statusbar" : {
      style : {
        backgroundColor : "background",
        width: [2, 0, 0, 0],
        color : "window-border-inner"
      }
    },

    "checkbox" : {
      decorator : [
        qx.ui.decoration.MBorderRadius,
        qx.ui.decoration.MSingleBorder
      ],

      style : {
        radius : 3,
        width : 1,
        color : "border-checkbox"
      }
    }
  }
});