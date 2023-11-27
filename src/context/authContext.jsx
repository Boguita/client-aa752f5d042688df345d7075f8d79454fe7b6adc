import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
  

export const AuthContexProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

 const login = async (inputs, setError) => {
    try {
      const res = await axios.post(
        "https://backuatrebeneficios.galgoproductora.com/api/auth/login",
        inputs,
        { withCredentials: true } // Asegúrate de incluir esta opción para enviar las cookies
      );
      if(res.status === 200){
      setCurrentUser(res.data);
      }
    } catch (error) {
      throw(error.response.data);
    }
  };
  
  const loginAdmin = async (inputs,setError) => {
    try {
      const res = await axios.post("https://backuatrebeneficios.galgoproductora.com/api/auth/login-aubenefits", inputs, 
      { withCredentials: true });
      if(res.status === 200){
      setCurrentUser(res.data);
      }
    } catch (error) {
      throw(error.response.data);
    }
  };

  const logout = async () => {
    
    try {
      await axios.post("https://backuatrebeneficios.galgoproductora.com/api/auth/logout");
      setCurrentUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
