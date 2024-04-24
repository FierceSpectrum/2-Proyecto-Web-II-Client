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

  const urlaccounts = `http://localhost:3006/graphql`;

  const getAccounts = async () => {
    const token = localStorage.getItem("token");
    await fetch(urlaccounts, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        {
          query: `query { getAllAccountsUser(iduser: "${user.id}" ) { id full_name pin avatar playlists } }`,
        }
    ),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("data");
        console.log(data);
        console.log(data.data);
        console.log(data.data.getAllAccountsUser);
        setAccounts(data.data.getAllAccountsUser);
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
