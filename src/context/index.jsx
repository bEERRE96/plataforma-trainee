import { createContext, useState } from "react";

const globalData = createContext({
  username: "",
  setUsername: () => {},
  statusOnline: false,
  setStatusOnline: () => {},
  typeUser : "",
  setTypeUser : () => {}
});

const DataProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [statusOnline, setStatusOnline] = useState(false);
  const [typeUser, setTypeUser] = useState("");

  return (
    <globalData.Provider
      value={{ username, setUsername, statusOnline, setStatusOnline, typeUser, setTypeUser }}
    >
      {children}
    </globalData.Provider>
  );
};

export { globalData, DataProvider };
