import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./Perfil.scss";
import VerificPin from "../Forms/VerificPin/VerificPin";

function Perfil(props) {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [logeado, setLogeado] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (logeado) {
      localStorage.setItem("Account", JSON.stringify(props.account));
      navigate("/Home");
    }
  }, [logeado, navigate, props.account]);

  const openPopup = () => {
    setErrorMessage("");
    setPinValue("");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (pinValue.toString() === props.account.pin.toString()) {
      setLogeado(true);
      // Cerrar la ventana emergente
      closePopup();
    } else {
      setErrorMessage("PIN incorrecto");
    }
  }, [pinValue, setPinValue]);

  return (
    <>
      <div className="flip-card" onClick={openPopup}>
        <div className="flip-card-front">
          <div className="profile-image">
            <div className="avatar">
              <img className="image" src={props.avatar} alt="" />
            </div>
            <div className="name">{props.full_name}</div>
          </div>
        </div>
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
}

export default Perfil;
