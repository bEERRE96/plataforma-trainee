import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getRegister } from "../../querys/querys";

const Register = () => {
  let navigate = useNavigate();
  const [fields, setFields] = useState({
    username: "",
    password: "",
    email: "",
    nombre: "",
    apellido: "",
    pais: "",
    edad: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    let regex = /^[a-zA-Z0-9]+$/g;

    const { name, value } = e.target;
    if (name != "email") {
      if (!regex.test(value) && value.length > 0) {
        setError("Caracteres invalidos");
        return;
      }
    }

    setFields({
      ...fields,
      [name]: value,
    });

    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const alphanumericRegex = /^[a-zA-Z0-9]+$/g;

    const { username, password, email, nombre, apellido, pais, edad } = fields;

    if (
      !username ||
      !password ||
      !email ||
      !nombre ||
      !apellido ||
      !pais ||
      !edad
    ) {
      setError("Faltan campos por rellenar");
      return;
    }

    if (!alphanumericRegex.test(username)) {
      setError("El nombre de usuario solo puede contener letras y números");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    async function register() {
      try {
        const response = await getRegister(fields);
        alert("Cuenta creada exitosamente");
        navigate("/");

        setError("");
      } catch (error) {
        setError(error.message);
      }
    }

    register();
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      <p>{error ? error : ""}</p>
      <form onSubmit={handleSubmit} className="register-form">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={fields.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={fields.nombre}
          onChange={handleChange}
          required
        />
        <label htmlFor="apellido">Apellido</label>
        <input
          type="text"
          id="apellido"
          name="apellido"
          value={fields.apellido}
          onChange={handleChange}
          required
        />
        <label htmlFor="pais">Pais</label>
        <input
          type="text"
          id="pais"
          name="pais"
          value={fields.pais}
          onChange={handleChange}
          required
        />
        <label htmlFor="edad">Edad</label>
        <input
          type="number"
          id="edad"
          name="edad"
          value={fields.edad}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <span>
        Si ya estás registrado, inicia sesión{" "}
        <Link to="/" className="link-underline">
          aquí
        </Link>
      </span>
    </div>
  );
};

export { Register };
