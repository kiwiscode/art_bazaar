import { createContext, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    userId: "",
    carts: [],
    active: false,
  });

  const updateUser = (newUserInfo) => {
    setUserInfo(() => newUserInfo);
  };

  const logout = () => {
    setUserInfo({
      username: "",
      email: "",
      userId: "",
      carts: [],
      active: false,
    });
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
