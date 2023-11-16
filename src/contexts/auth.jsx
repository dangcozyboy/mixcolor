import { message } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "../services/auth";

const Authcontext = createContext({});
const AuthProvider = ({ children }) => {
  const checkLogin = () => {
    return new Promise((resolve, reject) => {
      auth().then((res) => {
        resolve(res.includes(localStorage.getItem("token")));
      });
    });
  };

  const login = (token) => {
    auth().then((res) => {
      if (res.includes(token)) {
        localStorage.setItem("token", token);
        window.location.href = "/";
      } else {
        message.error("nhập sai thông tin");
      }
    });
  };
  return (
    <Authcontext.Provider value={{ checkLogin, login }}>
      <>{children}</>
    </Authcontext.Provider>
  );
};
const useAuth = () => {
  return useContext(Authcontext);
};
export { AuthProvider, useAuth, Authcontext };
