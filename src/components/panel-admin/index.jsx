import { useNavigate } from "react-router-dom";
import { useAuth } from "../../customHooks";
import {
  logPanelAdmin,
  desactivar,
  activar,
  eliminarCuenta,
  elegirPlan,
} from "../../querys/querys";
import { useState, useEffect, useCallback } from "react";
import { FormFecha } from "../fecha-update";

const PanelAdmin = () => {
  const { logout, typeUser } = useAuth();
  const [userType, setUserType] = useState("");
  const [fields, setFields] = useState([]);
  const [loaded, setLoaded] = useState(false);
  let navigate = useNavigate();
  const [estadoFecha, setEstadoFecha] = useState(false);
  const [userNameAct, setUserNameAct] = useState("");
  const [estadoPlan, setEstadoPlan] = useState(false);
  const [selectPlan, setSelectPlan] = useState(0);

  const renderAdmin = useCallback(async () => {
    const typeUs = await typeUser;
    setUserType(typeUs);
    const data = await logPanelAdmin(typeUs);
    setFields(data);
  }, [typeUser]);

  useEffect(() => {
    renderAdmin().then(() => setLoaded(true));
  }, [renderAdmin]);

  const desconectar = () => {
    logout();
    navigate("/"); // CAMBIAR A LOGIN CUANDO SE CREE LA RUTA LOGIN
  };

  const calcularVencimiento = (dia) => {
    const diaAlta = new Date(dia);
    const diaActual = new Date();
    const resta = diaAlta - diaActual;
    return resta < 0
      ? "Vencido"
      : `${Math.ceil(resta / (1000 * 60 * 60 * 24))} días`;
  };

  const desactivarCuenta = async (username) => {
    await desactivar(username);
    alert("Cuenta desactivada");
    await renderAdmin();
  };

  const activarCuenta = async (username) => {
    await activar(username);
    alert("Cuenta activada");
    await renderAdmin();
  };

  const handleChange = (e) => {
    const newPlan = e.target.value;
    setSelectPlan(newPlan);
  };

  const planSubmit = async (e) => {
    e.preventDefault();
    const response = await elegirPlan(userNameAct, selectPlan);
    alert("Plan cambiado con exito");
    await renderAdmin();
  };

  const borrarCuenta = async (username) => {
    let checkin = prompt(
      "Si desea eliminar esta cuenta, por favor escriba el nombre de usuario"
    );
    if (!checkin) return;
    if (checkin !== username) {
      alert("El nombre de usuario no coincide");
      return;
    }

    const response = await eliminarCuenta(username);
    alert(response);
    await renderAdmin();
  };

  return (
    <div className="panel-admin-container">
      <h1>PANEL ADMIN</h1>
      {loaded ? (
        fields.map((field, index) => (
          <div key={index} className="panel-admin-field">
            <p>Nombre: {field.nombre}</p>
            <p>Usuario: {field.username}</p>
            <p>Vencimiento: {calcularVencimiento(field.vencimiento)}</p>
            <p>Estado: {field.estado === 1 ? "Activo" : "Inactivo"}</p>
            <p>Plan: {field.tipo_plan}</p>
            <div className="panel-admin-field-buttons">
              <button
                onClick={() => {
                  setUserNameAct(field.username);
                  setEstadoFecha(true);
                }}
              >
                Renovar
              </button>
              <button onClick={() => desactivarCuenta(field.username)}>
                Desactivar
              </button>
              <button onClick={() => activarCuenta(field.username)}>
                Activar
              </button>
              <button onClick={() => borrarCuenta(field.username)}>
                Eliminar cuenta
              </button>
              <button
                onClick={() => {
                  navigate(`/panel-web/agregarEjercicios/${field.username}`);
                }}
              >
                Agregar ejercicio
              </button>
              <button
                onClick={() => {
                  setEstadoPlan(true);
                  setUserNameAct(field.username);
                }}
              >
                Plan
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>Cargando...</div>
      )}
      <button onClick={desconectar}>Cerrar Sesión</button>
      {estadoPlan && (
        <div className="tipo-plan-container-form">
          <button
            onClick={() => setEstadoPlan(!estadoPlan)}
            style={{ position: "absolute", top: "0", right: "0" }}
          >
            X
          </button>
          <h3>Seleccione el plan para "{userNameAct}"</h3>
          <form onSubmit={planSubmit}>
            <select defaultValue={"0"} onChange={handleChange}>
              <option value="0" disabled selected>
                Seleccione un plan
              </option>
              <option value="1">Basic</option>
              <option value="2">Premium</option>
              <option value="3">Pro</option>
            </select>
            <button type="submit">Confirmar</button>
          </form>
        </div>
      )}
      {estadoFecha && (
        <div className="panel-fecha-update">
          <button
            onClick={() => setEstadoFecha(!estadoFecha)}
            style={{ position: "absolute", top: "0", right: "0" }}
          >
            X
          </button>
          <FormFecha userName={userNameAct} displayState={estadoFecha} />
        </div>
      )}
    </div>
  );
};

export { PanelAdmin };
