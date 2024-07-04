import { useState } from "react";
import { useAuth } from "../../customHooks";
import { checkLogin } from "../../querys/querys";
import { useNavigate, Link } from "react-router-dom";
const Login = () => {
  let { login } = useAuth();

  let [fields, setFields] = useState({
    username: "",
    password: "",
  });

  let navigate = useNavigate();

  // SE RENDERIZA SI HAY FALLA EN EL LOGIN ( USER O PW INCORRECTA)
  let [error, setError] = useState(null);

  // FUNCION QUE SE ENVIA AL COMPLETAR EL FORMULARIO
  async function handleSubmit(e) {
    e.preventDefault();

    // SI CAMPOS VACIOS NO SE ENVIA
    if (fields.name === "" || fields.password === "") {
      setError("Faltan campos por rellenar");
      return;
    }

    try {
      //ENVIA A LA BASE DE DATOS EL username Y LA PASSWORD COMPLETADAS EN EL FORM
      let respuesta = await checkLogin(fields.username, fields.password);
      
      setError("Bienvenido " + respuesta.username);

      // SI RESPUESTA ( EL ARRAY QUE DEVUELVE EL BACK) SI TIENE INFO, SETEA EL USERNAME EN EL CONTEXT
      if (respuesta) {
        await login(respuesta.username, respuesta.type_user);
        setTimeout(() => navigate("/panel-web"), 1000);
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="login-container">
      <h1>CONECTARSE</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="username">Usuario: </label>
        <input
          type="text"
          id="username"
          value={fields.username}
          name="username"
          onChange={(event) => {
            setFields({ ...fields, username: event.target.value });
            setError(null); 
          }}
        />
        <label htmlFor="password">Contraseña: </label>
        <input
          type="password"
          name="password"
          id="password"
          value={fields.password}
          onChange={(event) => {
            setFields({ ...fields, password: event.target.value });
            setError(null); 
          }}
        />
        <input type="submit" value="Submit" />
      </form>
      <span>Si no estas registrado, haz click <Link to="/register" className="link-underline">aquí</Link> </span>
    </div>
  );
};

export { Login };
