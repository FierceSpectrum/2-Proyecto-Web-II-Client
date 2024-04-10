import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ConfirmAccount.scss";

function ConfirmAccount() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errorAccount, setErrorAccount] = useState();
  const [activateButton, setActivateButton] = useState(true);

  useEffect(() => {
    const verifyaccount = async () => {
      const url = `http://localhost:3002/api/usersVerificad?id=${id}&valid=false`;
      await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            if (response.status === 404) {
              await response.json().then((data) => {
                if (data.error === "User not found") {
                  setErrorAccount("No puedes utilizar este boton");
                  return;
                }
              });
            } else {
              throw new Error("Network response was not ok");
            }
          }
          return response.json();
        })
        .then((data) => {
          if (!data) {
            setErrorAccount("No puedes utilizar este boton");
            return;
          }
          setActivateButton(false);
        })
        .catch((error) => {
          console.log({ ErrorAccount: error });
          setErrorAccount("No puedes utilizar este boton");
        });
    };
    verifyaccount();
  }, [id]);
  const approvedaccount = async () => {
    const url = `http://localhost:3002/api/usersVerificad?id=${id}&valid=true`;
    await fetch(url, {
      method: "PATCH",
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
        navigate("/Login");
      })
      .catch((error) => {
        console.log({ ErrorAccount: error });
        setErrorAccount("No puedes utilizar este boton");
      });
  };
  
  return (
    <>
      <div className="body_confirmaccount">
        <div className="Message">
          <h2 className="Titulo">Confirm Your Account</h2>
          <div className="Bloque">
            <h2 className="Error">{errorAccount}</h2>
            <button
              className={"Button " + (activateButton ? "Bloqueado" : " ")}
              disabled={activateButton}
              onClick={() => approvedaccount()}
            >
              Activar Cuenta
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmAccount;
