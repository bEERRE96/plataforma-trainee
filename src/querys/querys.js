async function checkLogin(username, password) {
  try {
    const response = await fetch(process.env.REACT_APP_URL_LOGIN, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error en checkLogin:", error);
    throw error;
  }
}

async function getRutinaPorUsuario(username, dia) {
  try {
    const response = await fetch(process.env.REACT_APP_URL_RUTINA_POR_USUARIO, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        dia: dia,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getRutinaPorUsuario:", error);
    throw error;
  }
}

async function estadoCuenta(username) {
  try {
    const response = await fetch(process.env.REACT_APP_URL_ESTADO_CUENTA, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en estadoCuenta:", error);
    throw error;
  }
}

async function logPanelAdmin(typeUse) {
  try {
    const response = await fetch(process.env.REACT_APP_URL_PANEL_ADMIN, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type_user: typeUse,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en logPanelAdmin:", error);
    throw error;
  }
}

async function desactivar(username) {
  try {
    const response = await fetch(process.env.REACT_APP_URL_DESACTIVAR_CUENTA, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en desactivar:", error);
    throw error;
  }
}
async function activar(username) {
  try {
    const response = await fetch(process.env.REACT_APP_URL_ACTIVAR_CUENTA, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en activar:", error);
    throw error;
  }
}

async function renovarTiempo(username, fecha) {
  let venc = process.env.REACT_APP_URL_VENCIMIENTO;

  try {
    const response = await fetch(venc, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        fecha: fecha,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en renovarTiempo:", error);
    throw error;
  }
}

async function agregarRutina(username, dia, ejercicio) {
  try {
    const response = await fetch(process.env.REACT_APP_URL_AGREGAR_RUTINA, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        dia: dia,
        ejercicio: ejercicio,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en agregarRutina:", error);
    throw error;
  }
}

async function getEjercicios() {
  try {
    const response = await fetch(process.env.REACT_APP_URL_GET_EJERCICIOS);
    if (!response.ok) {
      throw new Error("Error desconocido");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer los ejercicios");
    throw error;
  }
}

async function getDias() {
  try {
    const response = await fetch(process.env.REACT_APP_URL_GET_DIAS_SEMANA);
    if (!response.ok) {
      throw new Error("Error desconocido");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer los dias de la semana");
    throw error;
  }
}

async function getRegister(formRegister) {
  try {
    const response = await fetch(process.env.REACT_APP_URL_GET_REGISTER, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formRegister),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Error de red. Verifica tu conexión.");
    } else {
      throw new Error(
        "Error al registrar el usuario. Inténtalo nuevamente más tarde."
      );
    }
  }
}

async function eliminarCuenta(username) {
  try {
    const response = await fetch(process.env.REACT_APP_URL_DELETE_CUENTA, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error(
      "Error al eliminar el usuario. Inténtalo nuevamente más tarde."
    );
    throw error;
  }
}

async function elegirPlan(username, plan) {
  try {
    const response = await fetch(process.env.REACT_APP_URL_CHANGE_PLAN, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        plan: plan,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }
  } catch (error) {
    console.error("Error al cambiar el plan. Inténtalo nuevamente más tarde.");
    throw error;
  }
}

export {
  checkLogin,
  getRutinaPorUsuario,
  estadoCuenta,
  logPanelAdmin,
  desactivar,
  activar,
  renovarTiempo,
  agregarRutina,
  getEjercicios,
  getDias,
  getRegister,
  eliminarCuenta,
  elegirPlan,
};
