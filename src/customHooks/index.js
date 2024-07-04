import { globalData } from "../context";
import { useContext } from "react";

const useAuth = () => {
  const { username, setUsername, statusOnline, setStatusOnline, typeUser, setTypeUser } =
    useContext(globalData);

  function login(user, userType) {
    setUsername(user);
    setStatusOnline(true);
    setTypeUser(userType);
  }

  function logout() {
    setUsername("");
    setStatusOnline(false);
    setTypeUser("");
  }

  return { username, login, logout, statusOnline, typeUser };
};

export { useAuth };
