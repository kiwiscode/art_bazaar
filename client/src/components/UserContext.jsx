import { createContext, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [username2, setUsername] = useState("");

  const updateUser = (newUsername) => {
    setUsername(newUsername);
  };

  const logout = () => {
    // setUsername("");
    setUsername("");
  };

  return (
    <UserContext.Provider value={{ username2, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
