import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeAdmin.scss";
import User from "../User/User";
import PerfilEdit from "../PerfilEdit/PerfilEdit";
import CreatAccount from "../../Accets/Perfil-usuario.webp";
import PlaylistEdit from "../PlaylistEdit/PlaylistEdit";

function HomeAdmin() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("Admin")));

  const [accounts, setAccounts] = useState([]);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    console.log(!admin);
    if (!admin) {
      navigate("/Profiles");
    } else {
      getAccounts();
    }
  }, [admin, setAdmin, navigate]);

  const urlaccounts = admin
    ? `http://localhost:3001/api/accounts?iduser=${admin.id}`
    : "";
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

  return (
    <div className="bodyHomeAd">
      <User></User>
      <div className="title">
        <h2>Edit Accounts</h2>
      </div>
      <div className="perfiles">
        {accounts.map((account, index) => (
          <PerfilEdit
            key={index}
            avatar={account.avatar}
            full_name={account.full_name}
            user={account}
            closeButton={setShowButton}
          ></PerfilEdit>
        ))}
        {Object.keys(accounts).length < 6 ? (
          <PerfilEdit
            key={0}
            avatar={CreatAccount}
            full_name={"Creat User"}
            user={[]}
            iduser={!admin ? 0 : admin.id}
            edit={"Create"}
            closeButton={setShowButton}
          ></PerfilEdit>
        ) : (
          <></>
        )}
      </div>
      <div className="button-return">
        {showButton && <PlaylistEdit iduser={!admin ? 0 : admin.id} />}
      </div>
      <div className="button-return">
        <button onClick={() => navigate("/Perfiles")} className="button">
          <svg
            className="svg-icon"
            fill="none"
            height="20"
            viewBox="0 0 20 20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="#00eeff" stroke-linecap="round" stroke-width="1.5">
              <path d="m3.33337 10.8333c0 3.6819 2.98477 6.6667 6.66663 6.6667 3.682 0 6.6667-2.9848 6.6667-6.6667 0-3.68188-2.9847-6.66664-6.6667-6.66664-1.29938 0-2.51191.37174-3.5371 1.01468"></path>
              <path d="m7.69867 1.58163-1.44987 3.28435c-.18587.42104.00478.91303.42582 1.0989l3.28438 1.44986"></path>
            </g>
          </svg>
          <span className="lable">Return</span>
        </button>
      </div>
    </div>
  );
}

export default HomeAdmin;
