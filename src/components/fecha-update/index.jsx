import { renovarTiempo } from "../../querys/querys";
import { useState } from "react";

const FormFecha = ({ userName, displayState }) => {
  const [fecha, setNuevaFecha] = useState("");
  const [visible, setVisible] = useState(displayState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await renovarTiempo(userName, fecha);
      alert("Fecha actualizada, el nuevo vencimiento es: " + fecha);
    } catch (error) {
      console.error("Error en handleSubmit:", error);
    }
  };

  return (
    visible && (
      <form
        id="formFechaUpdate"
        onSubmit={handleSubmit}
        className="fecha-update-form"
      >
        <label htmlFor="fechaNueva">Ingrese nueva fecha de vencimiento para:</label>
        <span>{`"${userName}"`}</span>
        <input
          type="date"
          id="fechaNueva"
          name="fechaNueva"
          onChange={(e) => setNuevaFecha(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>
    )
  );
};

export { FormFecha };
