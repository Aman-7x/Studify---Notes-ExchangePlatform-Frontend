import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { EndPoint } from "../apis/EndPoint";
import { toast } from "react-toastify";

export const Authenticate = createContext();

const Auth = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const verifyToken = async () => {
    
    try {
      const res = await axios.get(EndPoint.VERIFY_USER, 
        {withCredentials:true}
      );
      
      if (res.data.valid) {
        console.log("yes user data is Valid  : ",res.data);
        setUser({ ...res.data.user });
      } else {
        console.log("i am logouting");
        logout();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);
  const logout = async() => {
    try {
      const res = await axios.post(EndPoint.USER+"/logout");
      setUser(null);
      if(res.data.message == "Logged out successfully"){
      toast.success(res.data.message);
    }
    navigate("/signin");
    } catch (error) {
      toast.error(toast.message)
    }
  };

  const login = (userData)=>{
    setUser(userData);
    console.log("logeed in : ",userData);
  }

  return (
    <Authenticate.Provider
      value={{
        user: user,
        loading: loading,
        setLoading: setLoading,
        logout: logout,
        login:login,
        setUser: setUser,
      }}
    >
      {children}
    </Authenticate.Provider>
  );
};

export default Auth;
export const useAuth = ()=>useContext(Authenticate)