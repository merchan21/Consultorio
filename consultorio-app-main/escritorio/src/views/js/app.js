const { ipcRenderer } = require("electron");

let cedRepresentante = document.getElementById("ced_representante"),
   telfRepresentante = document.getElementById("tel_representante"),
   nomRepresentante = document.getElementById("nom_representante"),
   apeRepresentante = document.getElementById("ape_representante"),
   cedNinio = document.getElementById("ced_paciente"),
   nomNinio = document.getElementById("nom_paciente"),
   apeNinio = document.getElementById("ape_paciente"),
   edadNinio = document.getElementById("edad_paciente"),
   desNinio = document.getElementById("des_paciente"),
   id = document.getElementById("id"),
   msgError = document.querySelector(".alert-danger");

let newCita = {
   ced_representante: false,
   tel_representante: false,
   nom_representante: false,
   ape_representante: false,
   ced_paciente: false,
   nom_paciente: false,
   ape_paciente: false,
   edad_paciente: false,
   des_paciente: false,
};

const btnFormAddCita = document.getElementById("btn_form_add_cita");
if (btnFormAddCita) {
   btnFormAddCita.addEventListener("click", (e) => {
      ipcRenderer.send("form:cita", "");
   });
}

const formAddCita = document.getElementById("form_add_cita");
const btnAddCita = document.getElementById("btn_add_cita");
if (formAddCita) {
   validForm();
   formAddCita.addEventListener("submit", (e) => {
      e.preventDefault();
      btnAddCita.setAttribute("disabled", "disabled");
      if (isValidForm()) {
         newCita = {
            ced_representante: parseInt(cedRepresentante.value),
            tel_representante: parseInt(telfRepresentante.value),
            nom_representante: nomRepresentante.value,
            ape_representante: apeRepresentante.value,
            ced_paciente: parseInt(cedNinio.value),
            nom_paciente: nomNinio.value,
            ape_paciente: apeNinio.value,
            edad_paciente: parseInt(edadNinio.value),
            des_paciente: desNinio.value,
         };
         if (id.value !== "") {
            updateCita(parseInt(id.value), newCita);
         } else {
            createCitaFetch(newCita);
         }
      } else {
         btnAddCita.removeAttribute("disabled");
         msgError.classList.remove("d-none");
      }
   });
}

async function indexCitaFetch() {
   const data = await fetch(`http://localhost:5100/citas`);
   const result = await data.json();
   dataRender(result);
}

async function showCitaCedula(cedula) {
   const data = await fetch(`http://localhost:5100/cita?cedula=${cedula}`);
   const result = await data.json();
   dataRender(result);
}

async function createCitaFetch(cita) {
   const result = await fetch(`http://localhost:5100/citas`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(cita),
   });
   const data = await result.json();
   ipcRenderer.send("create:cita", "");
}

async function showCita(id) {
   const data = await fetch(`http://localhost:5100/cita/${id}`);
   const result = await data.json();
   ipcRenderer.send("show:cita", result);
}

async function updateCita(id, cita) {
   const result = await fetch(`http://localhost:5100/cita/${id}`, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(cita),
   });
   const data = await result.json();
   ipcRenderer.send("update:cita", "");
}

async function destroyCita(id) {
   const data = await fetch(`http://localhost:5100/cita/${id}`, {
      method: "DELETE",
   });
   const result = await data.json();
   ipcRenderer.send("destroy:cita", "");
}

function dataRender(data) {
   const tbody = document.getElementById("data");
   if (tbody) {
      let templateHtmlTable = "";
      data.forEach((cita) => {
         templateHtmlTable += ` 
      <tr>
         <th scope="row" class="py-3">${cita.id_cita}</th>
         <td class="py-3">${cita.nom_paciente}</td>
         <td class="py-3">${cita.ape_paciente}</td>
         <td class="py-3">${cita.edad_paciente}</td>
         <th scope="col" class="py-2">
            <button class="btn btn-sm btn-info" onclick="showCita(${cita.id_cita})">Ver descripcion</button>
         </th>
      </tr>
      `;
      });
      tbody.innerHTML = templateHtmlTable;
   }
}

const search = document.getElementById("search_cita"),
   buttonSearch = document.getElementById("search-addon");
if (buttonSearch) {
   buttonSearch.addEventListener("click", () => {
      const value = search.value;
      showCitaCedula(value);
   });
}

const reload = document.querySelector(".reload");
if (reload) {
   reload.addEventListener("click", () => {
      ipcRenderer.send("reload:window", "");
   });
}

ipcRenderer.on("show:cita:data", (e, data) => {
   const containerButtons = document.querySelector(".con-buttons-actions"),
      nikPacinete = document.getElementById("nik_paciente"),
      nombrePacinete = document.getElementById("nom_paciente"),
      apellidoPacinete = document.getElementById("ape_paciente"),
      edadPacinete = document.getElementById("edad_paciente"),
      cedulaPacinete = document.getElementById("ced_paciente"),
      descripcionPacinete = document.getElementById("des_paciente"),
      nombreRepresentante = document.getElementById("nom_representante"),
      apellidoRepresentante = document.getElementById("ape_representante"),
      telefonoRepresentante = document.getElementById("tel_representante"),
      cedulaRepresentante = document.getElementById("ced_representante");
   nikPacinete.textContent = `${data.nom_paciente} ${data.ape_paciente}`;
   nombrePacinete.textContent = `${data.nom_paciente}`;
   apellidoPacinete.textContent = `${data.ape_paciente}`;
   edadPacinete.textContent = `${data.edad_paciente}`;
   cedulaPacinete.textContent = `${data.ced_paciente}`;
   descripcionPacinete.textContent = `${data.des_paciente}`;
   nombreRepresentante.textContent = `${data.nom_representante}`;
   apellidoRepresentante.textContent = `${data.ape_representante}`;
   telefonoRepresentante.textContent = `${data.tel_representante}`;
   cedulaRepresentante.textContent = `${data.ced_representante}`;
   containerButtons.setAttribute("data-id", `${data.id_cita}`);
});

ipcRenderer.on("edit:cita:data", (e, data) => {
   id.value = data.id_cita;
   cedRepresentante.value = data.ced_representante;
   telfRepresentante.value = data.tel_representante;
   nomRepresentante.value = data.nom_representante;
   apeRepresentante.value = data.ape_representante;
   cedNinio.value = data.ced_paciente;
   nomNinio.value = data.nom_paciente;
   apeNinio.value = data.ape_paciente;
   edadNinio.value = data.edad_paciente;
   desNinio.value = data.des_paciente;
});

const btnDestroyCita = document.querySelector(".btn-destroy");
if (btnDestroyCita) {
   btnDestroyCita.addEventListener("click", (e) => {
      const parent = btnDestroyCita.parentElement;
      const id = parent.dataset.id;
      const response = confirm("¿Estas seguro de eliminar esta cita?");
      if (response) {
         destroyCita(id);
      }
   });
}

const btnEditCita = document.querySelector(".btn-edit");
if (btnEditCita) {
   btnEditCita.addEventListener("click", async (e) => {
      const parent = btnDestroyCita.parentElement;
      const id = parent.dataset.id;
      const data = await fetch(`http://localhost:5100/cita/${id}`);
      const cita = await data.json();
      ipcRenderer.send("form:cita:edit", cita);
   });
}

indexCitaFetch();

/**
 *
 * Script para validar el formulario
 *
 */

function validForm() {
   let bandera = 1;
   document.addEventListener("keyup", (e) => {
      const $input = e.target;
      if (bandera === 1) {
         const arr = Array.from(document.querySelectorAll(".form-control"));
         for (const e of arr) {
            if (e.value !== "") {
               newCita[e.id] = true;
            }
            if (e.id === $input.id) continue;
            console.log(e);
         }
         bandera = 2;
      }
      if (e.target.matches(".form-control")) {
         switch ($input.id) {
            case "ced_representante":
               validsChangeInput($input, /^\d{10}$/);
               break;
            case "tel_representante":
               validsChangeInput($input, /^\d{7,10}$/);
               break;
            case "nom_representante":
               validsChangeInput($input, /^[a-zA-ZÁ-ÿ\s]{1,40}$/);
               break;
            case "ape_representante":
               validsChangeInput($input, /^[a-zA-ZÁ-ÿ\s]{1,40}$/);
               break;
            case "ced_paciente":
               validsChangeInput($input, /^\d{10}$/);
               break;
            case "nom_paciente":
               validsChangeInput($input, /^[a-zA-ZÁ-ÿ\s]{1,40}$/);
               break;
            case "ape_paciente":
               validsChangeInput($input, /^[a-zA-ZÁ-ÿ\s]{1,40}$/);
               break;
            case "edad_paciente":
               validsChangeInput($input, /^\d{1,2}$/);
               break;
            case "des_paciente":
               validsChangeInputDes($input, /^[a-zA-ZÁ-ÿ1-9\s]{1,100}$/);
               break;

            default:
               break;
         }
      }
   });
}
function validsChangeInput(input, regExp) {
   const validation = RegExp(regExp);
   if (validation.test(input.value)) {
      inputSuccess(input);
   } else {
      inputError(input);
   }
}
function validsChangeInputDes(input, regExp) {
   const $errorInput = input.parentElement.nextElementSibling;
   const validation = RegExp(regExp);
   if (validation.test(input.value)) {
      $errorInput.classList.add("d-none");
      newCita[input.id] = true;
   } else {
      $errorInput.classList.remove("d-none");
      newCita[input.id] = false;
   }
}
const inputError = (input) => {
   const $errorInput = input.parentElement.nextElementSibling;
   const $checkIcon = input.nextElementSibling.nextElementSibling;
   const $errorIcon = input.nextElementSibling;

   $errorInput.classList.remove("d-none");
   $checkIcon.classList.remove("check-circle");
   $errorIcon.classList.add("times-circle-error");
   //input.classList.add("form-input-invalid");

   newCita[input.id] = false;
};

const inputSuccess = (input) => {
   const $errorInput = input.parentElement.nextElementSibling;
   const $checkIcon = input.nextElementSibling.nextElementSibling;
   const $errorIcon = input.nextElementSibling;

   //input.classList.remove("form-input-invalid");
   $errorIcon.classList.remove("times-circle-error");
   $errorInput.classList.add("d-none");
   $checkIcon.classList.add("check-circle");

   newCita[input.id] = true;
};
function isValidForm() {
   return (
      newCita.ced_representante &&
      newCita.tel_representante &&
      newCita.nom_representante &&
      newCita.ape_representante &&
      newCita.ced_paciente &&
      newCita.nom_paciente &&
      newCita.ape_paciente &&
      newCita.edad_paciente &&
      newCita.des_paciente
   );
}
