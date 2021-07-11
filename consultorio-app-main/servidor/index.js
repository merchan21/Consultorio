const express = require("express");
const cors = require("cors");
const { getConnection } = require("./database");

const app = express();
const port = 5100;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require("./database");

/**Retorna todas las citas */
app.get("/citas", async (req, res) => {
   try {
      const conn = await getConnection();
      const result = await conn.query("SELECT * FROM citas ORDER BY id_cita DESC");
      console.log(result);
      res.json(result);
   } catch (error) {
      console.log(error);
   }
});

/** Mostrar una cita  con la cedula*/
app.get("/cita", async (req, res) => {
   const cedula = parseInt(req.query.cedula);
   try {
      const conn = await getConnection();
      const result = await conn.query(
         "SELECT * FROM citas WHERE ced_paciente = ?",
         cedula
      );
      console.log(result);
      res.json(result);
   } catch (error) {
      console.log(error);
   }
});

/** Mostrar una cita */
app.get("/cita/:id", async (req, res) => {
   try {
      const conn = await getConnection();
      const result = await conn.query(
         "SELECT * FROM citas WHERE id_cita = ?",
         req.params.id
      );
      console.log(result);
      res.json(result);
   } catch (error) {
      console.log(error);
   }
});
/**Agrega una nueva cita*/
app.post("/citas", async (req, res) => {
   try {
      const conn = await getConnection();
      const result = await conn.query("INSERT INTO citas SET ?", req.body);
      console.log(result);
      res.json(result);
   } catch (error) {
      console.log(error);
   }
});

/** Acualiza una cita */
app.put("/cita/:id", async (req, res) => {
   try {
      const conn = await getConnection();
      const result = await conn.query("UPDATE citas SET ? WHERE id_cita = ?", [
         req.body,
         req.params.id,
      ]);
      console.log(result);
      res.json(result);
   } catch (error) {
      console.log(error);
   }
});

/**Elimina una cita */
app.delete("/cita/:id", async (req, res) => {
   try {
      const conn = await getConnection();
      const result = await conn.query(
         "DELETE FROM citas WHERE id_cita = ?",
         req.params.id
      );
      console.log(result);
      res.json(result);
   } catch (error) {
      console.log(error);
   }
});

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
