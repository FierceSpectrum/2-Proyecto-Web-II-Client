import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Email from "../Forms/Email/Email";
import Password from "../Forms/Password/Password";
import "./Login.scss";

function Login() {
  const navigate = useNavigate();

  const [logeado, setLogeado] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [user, setUser] = useState([]);
  const [errorlogin, setErrorLogin] = useState("");

  useEffect(() => {
    if (!!user.id) {
      setLogeado(true);
      setErrorLogin("");
    }

    if (logeado) {
      localStorage.setItem("User", JSON.stringify(user));
      localStorage.setItem("Login", true);
      navigate("/Profiles");
    }
  }, [user.id, logeado, navigate, user]);

  const urllogin = "http://localhost:3001/api/usersLogin";

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const Validar = async () => {
    const validemail = validarEmail(email);
    if (!validemail) {
      setErrorLogin("Invalid email format");
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    await fetch(urllogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          setErrorLogin("Error con la conexion");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        data.forEach((user) => {
          const data = {
            id: user._id,
            email: user.email,
            pin: user.pin,
            name: user.name,
            last_name: user.last_name,
          };
          setUser(data);
          return;
        });
        setErrorLogin("El usuario o contraseña son invalidos");
        return;
      })
      .catch((err) => {
        console.log("error: " + err);
        setErrorLogin("El usuario o contraseña son invalidos");
      });
  };

  return (
    <>
      <div className="boddylogin">
        <div className="container">
          <div className="heading">Sign In</div>
          <form
            action=""
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              Validar();
            }}
          >
            <p className="Error">{errorlogin}</p>
            <Email setEmail={setEmail} errorEmail={""} />

            <Password setPassword={setPassword} errorPassword={""} />
            <span className="forgot-password">
              <a href="/Register">Registrate</a>
            </span>
            <input className="login-button" type="submit" value="Sign In" />
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
