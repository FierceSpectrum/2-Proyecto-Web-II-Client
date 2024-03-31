import "./App.css";
import React, {useState} from "react";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Perfiles from "./Components/Perfiles/Perfiles";
import HomeAdmin from "./Components/HomeAdmin/HomeAdmin";

function App() {
  const [logueado, setLogueado] = useState(localStorage.getItem("Login"));
  const [user, setUser] = useState(localStorage.getItem("User"));
  const [admin, setAdmin] = useState(localStorage.getItem("Admin"));

  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              logueado && user? (
                  <Navigate to='/Perfiles' />
              ) : (
                <Navigate to='/Login' />
              )
            }
          ></Route>
          <Route
            path='/Home'
            element={<Home />}
          />
          <Route
            path='/Login'
            element={<Login />}
          />
          <Route
            path='/Register'
            element={<Register />}
          />
          <Route
            path='/Profiles'
            element={<Perfiles />}
          />
          <Route
            path='/HomeAdmin'
            element={<HomeAdmin />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
