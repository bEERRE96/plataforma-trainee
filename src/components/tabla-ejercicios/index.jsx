import { getEjercicios, getDias, agregarRutina } from "../../querys/querys";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const FormEjercicios = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [diasSemana, setDiasSemana] = useState([]);
  const { username } = useParams();

  const [agregarEjercicio, setAgregarEjercicio] = useState({
    username: username,
    ejercicios: "",
    diasSemana: "",
  });

  const handleChange = (event) => {
    setAgregarEjercicio({
      ...agregarEjercicio,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      agregarEjercicio.ejercicios === "" ||
      agregarEjercicio.diasSemana === ""
    ) {
      alert("Faltan campos por rellenar");
      return;
    }
    const data = await agregarRutina(
      agregarEjercicio.username,
      agregarEjercicio.diasSemana,
      agregarEjercicio.ejercicios
    );

    if (data) {
      alert("Ejercicio agregado");
      agregarEjercicio.ejercicios = "";
    }
  };

  useEffect(() => {
    async function ejercicios() {
      const data = await getEjercicios();
      setEjercicios(data);
      const data2 = await getDias();
      setDiasSemana(data2);
    }
    ejercicios();
  }, []);

  return (
    <div className="panel-agregar-ejercicios-container">
      <h1>Agregar ejercicio</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="ejercicio">Ejercicio:</label>
        <select
          name="ejercicios"
          id="ejercicios"
          onChange={handleChange}
          defaultValue={""}
        >
          <option value="" disabled selected>
            --Elija una opción--
          </option>
          {ejercicios.map((ejercicio) => (
            <option key={ejercicio.ID} value={ejercicio.nombre_ejercicio}>
              {ejercicio.nombre_ejercicio}
            </option>
          ))}
        </select>
        <label htmlFor="ejercicio">Dia:</label>
        <select
          name="diasSemana"
          id="diasSemana"
          onChange={handleChange}
          defaultValue={""}
        >
          <option value="" disabled selected>
            --Elija una opción--
          </option>
          {diasSemana.map((dia) => (
            <option key={dia.ID} value={dia.dia_semana}>
              {dia.dia_semana}
            </option>
          ))}
        </select>
        <label htmlFor="username">Usuario:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          readOnly
        />
        <input type="submit" value="Submit" />
      </form>
      <Link to="/panel-web" className="link-underline">
        Volver
      </Link>
    </div>
  );
};

export { FormEjercicios };
