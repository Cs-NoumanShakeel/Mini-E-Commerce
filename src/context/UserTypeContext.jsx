import { createContext, useContext, useState, useEffect } from "react";

const UserTypeContext = createContext();

export const UserTypeProvider = ({ children }) => {
  const [userType, setUserTypeState] = useState(() => {
    // Get from localStorage if available
    return localStorage.getItem("userType") || null;
  });

  const setUserType = (type) => {
    setUserTypeState(type);
    localStorage.setItem("userType", type); // Save to localStorage
  };

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export const useUserType = () => useContext(UserTypeContext);
