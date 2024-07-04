import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  PanelWeb,
  PanelAdmin,
  FormEjercicios,
  Register
} from "./components/index";
import { useAuth } from "./customHooks";

function App() {
  let { statusOnline, typeUser } = useAuth();


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/*CAMBIAR LA PALABRA ADMIN POR ALGO MAS COMPLICADO YA QUE SE PUEDE MODIFICAR EN COMPONENTS DE LA CONSOLA DE GOOGLE */}
        <Route
          path="/panel-web"
          element={
            !statusOnline ? (
              <Login />
            ) : typeUser === "admin" ? (
              <PanelAdmin />
            ) : (
              <PanelWeb />
            )
          }
        />
        <Route
          path="/panel-web/agregarEjercicios/:username"
          element={
            !statusOnline ? (
              <Login />
            ) : typeUser === "admin" ? (
              <FormEjercicios />
            ) : (
              <PanelWeb />
            )
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
