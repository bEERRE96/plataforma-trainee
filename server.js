const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("./src/config/config")
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ruta de logeo

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Faltan campos por rellenar" });
    }

    const consulta = "SELECT * FROM cuenta_usuarios WHERE username = ?";
    const [result] = await pool.query(consulta, [username.toLowerCase()]);

    if (result.length === 1) {
      const passCompare = bcrypt.compareSync(password.toLowerCase(), result[0].password);

      if (passCompare) {
        if (result[0].estado === 0) {
          return res.status(400).json({
            error: "La cuenta se encuentra desactivada, por favor ponte en contacto con un administrador.",
          });
        }

        const token = jwt.sign(
          {
            id: result[0].id,
            username: result[0].username,
            type_user: result[0].type_user, // Asegúrate de incluir el tipo de usuario en el token
          },
          config.secretKey,
          { expiresIn: config.expiresIn }
        );

        res.status(200).json({ token, result: result[0] });
      } else {
        res.status(400).json({ error: "Credenciales incorrectas" });
      }
    } else {
      res.status(400).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error al ejecutar la consulta: " + error.message });
  }
});

// Ruta para obtener la rutina por usuario y dia
app.post("/rutinaPorDia", async (req, res) => {
  try {
    // trae username y dia de la peticion
    let { username, dia } = req.body;

    // Consulta SQL para obtener la información por día
    const consulta =
      "SELECT cu.username as usuario, ej.nombre_ejercicio as ejercicio, dias_semana.dia_semana as dia " +
      "FROM rutinas " +
      "JOIN dias_semana ON rutinas.dia_id = dias_semana.ID " +
      "JOIN ejercicios as ej ON ej.ID = rutinas.ejercicio_id " +
      "JOIN cuenta_usuarios as cu ON cu.ID = rutinas.username_id " +
      "WHERE dia_semana = ? AND username = ?;";

    // Ejecutar la consulta SQL ( Segundo parametro reemplaza los ? de la consulta SQL )
    const [resultado] = await pool.query(consulta, [
      dia.toLowerCase(),
      username.toLowerCase(),
    ]);

    // Enviar la respuesta con el resultado de la consulta
    res.json(resultado);
  } catch (error) {
    // Manejar errores
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).send("Error al ejecutar la consulta: " + error.message);
  }
});

// Ruta para obtener ejercicios

app.get("/listaEjercicios", async (req, res) => {
  try {
    const consulta = "SELECT * FROM ejercicios";
    const [ejercicios] = await pool.query(consulta);
    res.send(ejercicios);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).send("Error al ejecutar la consulta: " + error.message);
  }
});

// Ruta para obtener los dias de la semana

app.get("/diasSemana", async (req, res) => {
  try {
    const consulta = "SELECT * FROM dias_semana";
    const [diasSemana] = await pool.query(consulta);
    res.send(diasSemana);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).send("Error al ejecutar la consulta: " + error.message);
  }
});

// LLAMADA PARA VER TIEMPO RESTANTE DEL PLAN

app.post("/tiempoRestante", async (req, res) => {
  try {
    let { username } = req.body;
    const consulta =
      "SELECT fecha_plan, estado, tipo_plan FROM cuenta_usuarios WHERE username = ?";
    const [result] = await pool.query(consulta, [username.toLowerCase()]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res
      .status(500)
      .json({ error: "Error al ejecutar la consulta: " + error.message });
  }
});

// LLAMADA PARA RENDERIZAR PANEL ADMIN

app.post("/renderPanelAdmin", async (req, res) => {
  let { type_user } = req.body;

  if (type_user == "admin") {
    try {
      const consulta =
        "SELECT username, fecha_plan as vencimiento, estado, tipo_plan, nombre FROM cuenta_usuarios where type_user = 'user'";
      const [result] = await pool.query(consulta);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al ejecutar la consulta:", error);
      res
        .status(500)
        .json({ error: "Error al ejecutar la consulta: " + error.message });
    }
  }
});

// LLAMADA PARA DESACTIVAR CUENTA

app.patch("/desactivarCuenta", async (req, res) => {
  let { username } = req.body;

  try {
    const consulta = "UPDATE cuenta_usuarios SET estado = 0 WHERE username = ?";
    const [result] = await pool.query(consulta, [username.toLowerCase()]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res
      .status(500)
      .json({ error: "Error al ejecutar la consulta: " + error.message });
  }
});

// LLAMADA PARA ACTIVAR CUENTA

app.patch("/activarCuenta", async (req, res) => {
  let { username } = req.body;

  try {
    const consulta = "UPDATE cuenta_usuarios SET estado = 1 WHERE username = ?";
    const [result] = await pool.query(consulta, [username.toLowerCase()]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res
      .status(500)
      .json({ error: "Error al ejecutar la consulta: " + error.message });
  }
});

// LLAMADA PARA AGREGAR RUTINA EN CUENTA DE USUARIOS

app.post("/agregarRutina", async (req, res) => {
  let { username, dia, ejercicio } = req.body;

  try {
    const consulta = `INSERT INTO rutinas (dia_id, ejercicio_id, username_id) VALUES (
(SELECT id from dias_semana WHERE dia_semana = ?), 
(SELECT id from ejercicios WHERE nombre_ejercicio = ?), 
(select id from cuenta_usuarios WHERE username = ?)
);`;

    const [result] = await pool.query(consulta, [
      dia.toLowerCase(),
      ejercicio.toLowerCase(),
      username.toLowerCase(),
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res
      .status(500)
      .json({ error: "Error al ejecutar la consulta: " + error.message });
  }
});

// LLAMADA PARA MODIFICAR VENCIMIENTO PLAN

app.post("/modificarVencimiento", async (req, res) => {
  let { username, fecha } = req.body;

  /* if (!username || !fecha) {
    return res.status(400).json({ error: "Faltan campos por rellenar" });
  } */

  try {
    const consulta =
      "UPDATE cuenta_usuarios SET fecha_plan = ? WHERE username = ?";
    const [result] = await pool.query(consulta, [
      fecha,
      username.toLowerCase(),
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res
      .status(500)
      .json({ error: "Error al ejecutar la consulta: " + error.message });
  }
});

// LLAMADA PARA AGREGAR CUENTA nueva

app.post("/agregarCuentaNueva", async (req, res) => {
  let {
    username,
    password,
    email,
    nombre,
    apellido,
    pais,
    edad,
  } = req.body;

  // Validar caracteres alphanuméricos y longitud de la contraseña en el servidor
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  if (!alphanumericRegex.test(username) ||
      !alphanumericRegex.test(nombre) ||
      !alphanumericRegex.test(apellido) ||
      !alphanumericRegex.test(pais)) {
    return res.status(400).json({ error: "Uno de los campos contiene caracteres inválidos" });
  }

  if (!/^[a-zA-Z0-9*]+$/.test(password)) {
    return res.status(400).json({ error: "La contraseña contiene caracteres inválidos" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
  }

  let typeUser = "user";
  let typeState = 1;
  let datePlan = new Date();
  
  let hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const consulta =
      "INSERT INTO cuenta_usuarios (username, password, email, nombre, apellido, pais, edad, type_user, estado, fecha_plan) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)";

    const [result] = await pool.query(consulta, [
      username,
      hashedPassword,
      email,
      nombre,
      apellido,
      pais,
      edad,
      typeUser,
      typeState,
      datePlan,
    ]);
    res.status(200).json({ message: "Cuenta creada con éxito" });
  } catch (error) {
    res
      .status(400)
      .json({
        error:
          "Error al procesar la solicitud. Inténtalo nuevamente más tarde.",
      });
  }
});


// LLAMADA PARA BORRAR CUENTA

app.delete("/borrarCuenta", async (req, res) => {
  let { username } = req.body;

  try {
    const consultaId = "SELECT id FROM cuenta_usuarios WHERE username = ?";
    const [resultId] = await pool.query(consultaId, [username.toLowerCase()]);

    const consulta = "DELETE FROM cuenta_usuarios WHERE id = ?";
    const [result] = await pool.query(consulta, [resultId[0].id]);

    res.status(200).json({ message: "Cuenta eliminada" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar la cuenta, cuenta no encontrada" });
  }
})

// LLAMADA PARA ELEGIR PLAN ( de admin a uysuario)

app.patch("/elegirPlan", async (req, res) => {
  let { username, plan } = req.body;
  try {
    const consulta = "UPDATE cuenta_usuarios SET tipo_plan = ? WHERE username = ?";
    const [result] = await pool.query(consulta, [plan, username.toLowerCase()]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res
      .status(500)
      .json({ error: "Error al ejecutar la consulta: " + error.message });
  }
})

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor ON");
});
