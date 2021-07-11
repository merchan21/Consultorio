const { Menu } = require("electron");

module.exports.createMenu = function (addCita) {
   const templateMenu = [
      {
         label: "Agregar",
         submenu: [
            {
               label: "Nueva cita",
               click() {
                  addCita();
               },
            },
         ],
      },
   ];
   const mainMenu = Menu.buildFromTemplate(templateMenu);
   Menu.setApplicationMenu(mainMenu);
};
