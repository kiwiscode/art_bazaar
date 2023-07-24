import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    return (
      storedUserInfo || {
        username: "",
        email: "",
        userId: "",
        carts: [],
        active: false,
        address: "",
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  const updateUser = (newUserInfo) => {
    setUserInfo(newUserInfo);
  };

  const logout = () => {
    setUserInfo({
      username: "",
      email: "",
      userId: "",
      carts: [],
      active: false,
      address: "",
    });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  const setToken = (token) => {
    localStorage.setItem("token", token);
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };
  console.log(userInfo);
  return (
    <UserContext.Provider
      value={{
        userInfo,
        updateUser,
        logout,
        setToken,
        getToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
