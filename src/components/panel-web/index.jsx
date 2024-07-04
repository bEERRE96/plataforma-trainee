import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../customHooks";
import { getRutinaPorUsuario, estadoCuenta } from "../../querys/querys";
import { useNavigate } from "react-router-dom";

const PanelWeb = () => {
  let [fields, setFields] = useState({ username: "", dia: "" });
  let [rutinas, setRutinas] = useState([]);
  let navigate = useNavigate();
  let { username, logout } = useAuth();
  let [accountState, setEstadoCuenta] = useState([]);
  let [loaded, setLoaded] = useState(false);

  const statusAccount = useCallback(async () => {
    let estado = await estadoCuenta(username);
    setEstadoCuenta(estado);
  }, [username]);

  async function handleSubmit(dia) {
    let rutina = await getRutinaPorUsuario(username, dia);
    setRutinas(rutina);
    await statusAccount();
  }

  function desconectar() {
    logout();
    navigate("/"); /*CAMBIAR A LOGIN CUANDO SE CREE LA RUTA LOGIN */
  }

  function calcularVencimiento(dia) {
    let diaAlta = new Date(dia);
    let diaActual = new Date();
    let resta = diaAlta - diaActual;
    if (resta < 0) {
      return "Vencido";
    }
    return `${Math.ceil(resta / (1000 * 60 * 60 * 24))} días`;
  }

  const handleChange = (e) => {
    const newDia = e.target.value;
    setFields({ ...fields, dia: newDia });
    handleSubmit(newDia);
  };

  useEffect(() => {
    statusAccount().then(() => setLoaded(true));
  }, [statusAccount]);

  return (
    <div className="panel-web-container">
      <h1>Panel Web</h1>
      <div className="panel-web-user-info-container">
        <h2>Bienvenido {username}</h2>
        {loaded && accountState.length > 0 ? (
          <div className="panel-web-user-info-data">
            <span>
              Estado: {accountState[0].estado === 1 ? "Activo" : "Inactivo"}
            </span>
            <span>
              Vencimiento: {calcularVencimiento(accountState[0].fecha_plan)}
            </span>
            <span>Plan: {accountState[0].tipo_plan}</span>
          </div>
        ) : (
          <div>Cargando...</div>
        )}
      </div>

      <h3>Rutinas</h3>
      <div className="panel-web-rutinas-container">
        <p>Seleccione el día que desee ver sus rutinas:</p>
        <select
          name="dias_semana"
          id="dias_semana"
          value={fields.dia}
          onChange={handleChange}
        >
          <option value="" disabled selected>-- Seleccione --</option>
          <option value="lunes">Lunes</option>
          <option value="martes">Martes</option>
          <option value="miércoles">Miércoles</option>
          <option value="jueves">Jueves</option>
          <option value="viernes">Viernes</option>
          <option value="sábado">Sábado</option>
        </select>
      </div>
      <div>
        {rutinas.length > 0 ? (
          <table className="panel-web-rutinas-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Día</th>
                <th>Ejercicio</th>
                <th>Repeticiones</th>
              </tr>
            </thead>
            <tbody>
              {rutinas.map((rutina) => (
                <tr key={rutina.id}>
                  <td>{rutina.usuario}</td>
                  <td>{rutina.dia}</td>
                  <td>{rutina.ejercicio}</td>
                  <td>4x10</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="panel-web-no-rutinas">No hay rutinas para este día</p>
        )}
      </div>
      <div className="panel-web-button-container">
        <button onClick={desconectar}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export { PanelWeb };
