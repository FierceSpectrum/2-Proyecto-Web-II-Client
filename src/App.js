import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Perfiles from "./Components/Perfiles/Perfiles";
import HomeAdmin from "./Components/HomeAdmin/HomeAdmin";
import ConfirmAccount from "./Components/ConfirmAccount/ConfirmAccount";

function App() {
  const [logueado, setLogueado] = useState(localStorage.getItem("Login"));
  const [user, setUser] = useState(localStorage.getItem("User"));
  const [admin, setAdmin] = useState(localStorage.getItem("Admin"));
  const [interceptorExecuted, setInterceptorExecuted] = useState(false);

  // useEffect(() => {
  //   if (!(logueado && user)) {
  //     window.location.href = "/Login";
  //   }
  // }, []);

  useEffect(() => {
    if (!interceptorExecuted) {
      // Intercepta las solicitudes fetch
      const originalFetch = window.fetch;
      window.fetch = function (...args) {
        return originalFetch
          .apply(this, args)
          .then((response) => {
            console.log("response");
            console.log(response.url);
            if (response.url === 'http://localhost:3002/api/users'){
              console.log("notocar");
              return response;
            }
            // Verifica si la respuesta es exitosa
            if (!response.ok) {
              // Si hay un error, lanzamos una excepción
              console.log("hee");
              if (
                response.status === 401 &&
                response.statusText === "Unauthorized"
              ) {
                // Marcar el interceptor como ejecutado
                setInterceptorExecuted(true);
              }
              return;
            }
            return response;
          })
          .catch((error) => {
            console.error("Error en la solicitud fetch:", error);
            // toast.error("Se ha producido un error en la solicitud");
            throw error;
          });
      };
      setTimeout(() => {
        window.fetch = originalFetch;
      }, 5000);
    }
  }, []);

  // Reiniciar interceptorExecuted cuando se vuelve al inicio de sesión
  useEffect(() => {
    if (interceptorExecuted) {
      toast.error("Se expiró el tiempo de tu sesión");
      // Esperar 2 segundos antes de redirigir al usuario
      setTimeout(() => {
        localStorage.clear();
        setLogueado(localStorage.getItem("Login"));
        window.location.href = "/Login";
      }, 5000);
    }
  }, [interceptorExecuted]);

  useEffect(() => {
    setInterceptorExecuted(false);
  }, [logueado]);

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              logueado && user ? (
                <Navigate to="/Profiles" />
              ) : (
                <Navigate to="/Login" />
              )
            }
          ></Route>
          <Route path="/Home" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Profiles" element={<Perfiles />} />
          <Route path="/HomeAdmin" element={<HomeAdmin />} />
          <Route path="/ConfirmAccount/:id" element={<ConfirmAccount />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
