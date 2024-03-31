import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Perfiles.scss";
import Perfil from "../Perfil/Perfil";
import VerificPin from "../Forms/VerificPin/VerificPin";
import User from "../User/User";

const Perfiles = () => {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [logeado, setLogeado] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("User")));
  const [accounts, setAccounts] = useState([]);

  const urlaccounts = `http://localhost:3001/api/accounts?iduser=${user.id}`;

  useEffect(() => {
    if (logeado) {
      localStorage.setItem("Admin", JSON.stringify(user));
      localStorage.setItem("Account", JSON.stringify(user));
      navigate("/HomeAdmin");
    } else {
      localStorage.removeItem("Admin");
    }
  }, [logeado, navigate, user]);

  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = async () => {
    await fetch(urlaccounts, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAccounts(data);
        return;
      })
      .catch((err) => {
        console.log("error: " + err);
      });
  };

  const openPopup = () => {
    setErrorMessage("");
    setPinValue("");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (pinValue.toString() === user.pin.toString()) {
      setLogeado(true);
      // Cerrar la ventana emergente
      closePopup();
    } else {
      setErrorMessage("PIN incorrecto");
    }
  }, [pinValue, setPinValue]);

  return (
    <>
      <div className="bodyPerfiles">
        <h2>Who is watching now?</h2>

        <div className="perfiles">
          {accounts.map((account, index) => (
            <Perfil
              key={index}
              account={account}
              avatar={account.avatar}
              full_name={account.full_name}
            ></Perfil>
          ))}
        </div>

        <button className="btnadmin" onClick={openPopup}>
          Manage profiles
        </button>
      </div>
      {showPopup && (
        <>
          <div className="popup-overlay">
            <VerificPin
              closePopup={closePopup}
              setPin={setPinValue}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Perfiles;
