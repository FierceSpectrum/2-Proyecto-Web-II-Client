import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Email from "../Forms/Email/Email";
import Password from "../Forms/Password/Password";
import VerificCode from "../Forms/VerificCode/VerificCode";
import "./Login.scss";

function Login() {
  const navigate = useNavigate();

  const [logeado, setLogeado] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [user, setUser] = useState([]);
  const [errorlogin, setErrorLogin] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [CodeValue, setCodeValue] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const openPopup = () => {
    setErrorMessage("");
    setCodeValue("");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (CodeValue.length === 6) {
      ValidarCode()
    } else {
      setErrorMessage("Code incorrecto");
    }
  }, [CodeValue, setCodeValue]);

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

  const urllogin = "http://localhost:3002/api/session";

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
      .then((response) => {
        localStorage.setItem("token", response);
        openPopup();
        return;
      })
      .catch((err) => {
        console.log("error: " + err);
        setErrorLogin("El usuario o contraseña son invalidos");
      });
  };

  
  const ValidarCode = async () => {
    const urlCode = "http://localhost:3002/api/authentication";
    const data = {
      code: CodeValue,
    };
    const token = localStorage.getItem("token");
    await fetch(urlCode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
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
      .then((response) => {
        const user = response.user;
        const data = {
          id: user.userID,
          email: user.email,
          pin: user.pin,
          name: user.name,
          last_name: user.last_name,
        };
        setUser(data);
        closePopup();
        console.log(response.token)
        localStorage.setItem("token", response.token);
        return;
      })
      .catch((err) => {
        
        console.log("error: " + err);
        setErrorMessage("Code incorrecto");
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

      {showPopup && (
        <>
          <div className="popup-overlay">
            <VerificCode
              closePopup={closePopup}
              setCode={setCodeValue}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              ValidarCode={ValidarCode}
            />
          </div>
        </>
      )}
    </>
  );
}

export default Login;
