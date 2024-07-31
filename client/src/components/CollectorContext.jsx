import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const CollectorContext = createContext();

const CollectorProvider = ({ children }) => {
  const [collectorInfo, setCollectorInfo] = useState(() => {
    const storedCollectorInfo = JSON.parse(
      localStorage.getItem("collectorInfo")
    );
    return (
      storedCollectorInfo || {
        name: "",
        email: "",
        collectorId: "",
        active: false,
        order: [],
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("collectorInfo", JSON.stringify(collectorInfo));
  }, [collectorInfo]);

  const updateCollector = (newCollectorInfo) => {
    setCollectorInfo((prevCollectorInfo) => ({
      ...prevCollectorInfo,
      ...newCollectorInfo,
    }));
  };

  const logout = () => {
    setCollectorInfo({
      name: "",
      email: "",
      collectorId: "",
      active: false,
      order: [],
    });
    localStorage.removeItem("collectorInfo");
    localStorage.removeItem("token");
  };

  const setToken = (token) => {
    localStorage.setItem("token", token);
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <CollectorContext.Provider
      value={{
        collectorInfo,
        updateCollector,
        logout,
        setToken,
        getToken,
      }}
    >
      {children}
    </CollectorContext.Provider>
  );
};

CollectorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CollectorContext, CollectorProvider };
