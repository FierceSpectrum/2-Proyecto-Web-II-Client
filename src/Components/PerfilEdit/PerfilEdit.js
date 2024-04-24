import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./PerfilEdit.scss";

function PerfilEdit(props) {
  const navigate = useNavigate();

  const [request, setRequest] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [showPopupAvatars, setShowPopupAvatars] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [full_name, setFull_Name] = useState(props.user.full_name);
  const [avatar, setAvatar] = useState(props.avatar);
  const [pin, setPin] = useState(props.user.pin);
  const [age, setAge] = useState(props.user.age);

  const [showPlaylists, setShowPlaylists] = useState(false);
  const [showPopupPlaylistC, setShowPopupPlaylistC] = useState(false);
  const [showPopupDeleteP, setShowPopupDeleteP] = useState(false);

  const [playlistsAccount, setPlaylistsAccount] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const [nameP, setNameP] = useState("");

  const openPopupPlaylists = () => {
    setShowPlaylists(!showPlaylists);
  };

  const PopupDeleteP = () => {
    setShowPopupDeleteP(!showPopupDeleteP);
  };

  const chargeplaylist = (playlist) => {
    setPlaylist(playlist);
    setNameP(playlist.name);
  };

  const openPopupPlaylistC = (playlist) => {
    chargeplaylist(playlist);
    setShowPopupPlaylistC(true);
  };
  const closePopupPlaylistC = (playlist) => {
    setShowPopupPlaylistC(false);
  };

  useEffect(() => {}, []);

  const clear = () => {
    setFull_Name(props.user.full_name);
    setAvatar(props.avatar);
    setPin(props.user.pin);
    setAge(props.user.age);
    setErrorMessage("");
  };

  const openPopup = () => {
    clear();
    setShowPopup(true);
    props.closeButton(showPopup);
  };

  const closePopup = () => {
    clear();
    setShowPopup(false);
    props.closeButton(showPopup);
  };

  const PopupAvatars = () => {
    setShowPopupAvatars(!showPopupAvatars);
  };
  const PopupDelete = () => {
    setShowPopupDelete(!showPopupDelete);
  };

  const handlePinChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    setPin(value);
  };

  useEffect(() => {
    if (request) {
      console.log("que?");
      window.location.reload();
    }
  }, [request, setRequest]);

  const handleSubmit = () => {
    if (pin.toString().length !== 6) {
      setErrorMessage("El pin deve de ser de 6 digitos");
      return;
    }

    if (!!props.user.id) {
      update();
      return;
    }
    create();
  };

  const url = !!props.user.id
    ? `http://localhost:3002/api/accounts?id=${props.user.id}`
    : "http://localhost:3002/api/accounts";
  const update = async () => {
    const token = localStorage.getItem("token");
    const data = await {
      full_name: full_name,
      avatar: avatar,
      pin: parseInt(pin),
      age: age,
    };

    await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          setErrorMessage("Error con la conexion");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRequest(true);
      })
      .catch((err) => {
        setErrorMessage("Datos invalidos");
      });
  };

  const create = async () => {
    if (avatar === props.avatar) {
      setErrorMessage("Select a profile photo");
      return;
    }

    const data = await {
      full_name: full_name,
      avatar: avatar,
      pin: parseInt(pin),
      age: age,
      user: props.iduser,
    };
    console.log(data);
    const token = localStorage.getItem("token");
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          setErrorMessage("Error con la conexion");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setRequest(true);
      })
      .catch((err) => {
        setErrorMessage("Datos invalidos");
      });
  };

  const urldeleted = `http://localhost:3002/api/accounts?id=${props.user.id}`;
  const eliminate = async () => {
    const token = localStorage.getItem("token");
    await fetch(urldeleted, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          setErrorMessage("Error con la conexion");
          throw new Error("Network response was not ok");
        }
        console.log(response);
        return response;
      })
      .then((data) => {
        console.log(data);
        setRequest(true);
      })
      .catch((err) => {
        setErrorMessage("Datos invalidos " + { err });
      });
  };

  const [avatars, setAvatars] = useState([]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    // Función para cerrar el menú cuando se hace clic fuera de él
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPopupAvatars(false);
      }
    }

    // Agregar event listener al montar el componente
    document.addEventListener("click", handleClickOutside);

    // Limpiar event listener al desmontar el componente
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!avatars.length) {
      loadinAvatars();
    }
  }, [avatars]);

  const loadinAvatars = async () => {
    try {
      const urlaccounts = `http://localhost:3006/graphql`;
      const token = localStorage.getItem("token");
      const response = await fetch(urlaccounts, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `query { getAllAvatars { url } }`,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { data } = await response.json();
      setAvatars(data.getAllAvatars);
    } catch (error) {
      console.log({ Error: error });
    }
  };

  const chargplaylist = () => {
    try {
      const playlists = [];
      props.user.playlists.map(async (idplaylist) => {
        console.log(idplaylist);
        const urlaccounts = `http://localhost:3006/graphql`;
        const token = localStorage.getItem("token");
        const response = await fetch(urlaccounts, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `query { getPlaylist(id: "${idplaylist}" ) { id name playlist { id }} }`,
          }),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const { data } = await response.json();
        console.log(data.getPlaylist);
        playlists.push(data.getPlaylist);
      });
      setPlaylistsAccount(playlists);
    } catch (error) {
      console.log({ Error: error });
    }
  };

  const eliminatePlaylist = async (playlist) => {
    let playlistsAccount2 = playlistsAccount;
    console.log(playlist)
    const urlaccounts = `http://localhost:3002/api/accountsPlaylist?id=${props.user.id}&idplaylist=${playlist.id}`;
    const token = localStorage.getItem("token");
    await fetch(urlaccounts, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((playlist) => {
        console.log();
        playlistsAccount2 = playlistsAccount2.filter(function (value) {
          return value !== props.user.id;
        });
        setPlaylistsAccount(playlistsAccount2);
        setRequest(true);
      })
      .catch((error) => {
        console.log({ Error: error });
      });
  };

  const addPlaylist = async (playlist) => {
    console.log(playlist.id);
    const data = await {
      playlist: playlist.id,
    };
    console.log(data);
    const urlaccounts = `http://localhost:3002/api/accountsPlaylist?id=${props.user.id}`;
    const token = localStorage.getItem("token");
    await fetch(urlaccounts, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((playlist) => {
        console.log(playlist);
        setRequest(true);
      })
      .catch((error) => {
        console.log({ Error: error });
      });
  };

  const chargallplaylist = async () => {
    try {
      const urlaccounts = `http://localhost:3006/graphql`;
      const token = localStorage.getItem("token");
      console.log(localStorage);
      console.log(props.user);
      console.log(props.user.user);
      const response = await fetch(urlaccounts, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `query { getAllPlaylistsUser(iduser: "${props.user.user}" ) { id name playlist {  id name }} }`,
        }),
      });
      console.log("response");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { data } = await response.json();
      console.log(data);
      setPlaylists(data.getAllPlaylistsUser);
    } catch (error) {
      console.log({ Error: error });
    }
  };

  return (
    <>
      <>
        <div
          className="flip-card"
          onClick={() => {
            !props.edit ? chargplaylist() : console.log();
            openPopup();
          }}
        >
          <div className="flip-card-front">
            <div className="profile-image">
              <div className="card-top">
                <p className="card-top-para">
                  {!props.edit ? "Edit" : props.edit}
                </p>
              </div>
              <div className="avatar">
                <img className="image" src={props.avatar} alt="" />
              </div>
              <div className="name">{props.full_name}</div>
            </div>
          </div>
        </div>
      </>

      {showPopup && (
        <>
          <div className="popup-overlay2">
            <div className="popup">
              <div className="form-card1">
                <div className="form-card2">
                  <div className="form-header"></div>
                  <form
                    className="form"
                    action=""
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (
                        !(
                          full_name === props.user.full_name &&
                          avatar === props.avatar &&
                          pin === props.user.pin &&
                          age === props.user.age
                        )
                      ) {
                        handleSubmit();
                      }
                    }}
                  >
                    <div className="popup-header">
                      <button className="close-button" onClick={closePopup}>
                        X
                      </button>
                    </div>
                    <div className="avatar" onClick={PopupAvatars}>
                      <img className="image" src={avatar} alt="" />
                    </div>
                    <p className="form-heading">Get In Touch</p>

                    <p className="Error">{errorMessage}</p>
                    <p className="placeholder">Full Name</p>
                    <div className="form-field">
                      <input
                        required
                        onChange={(ev) => setFull_Name(ev.target.value)}
                        placeholder="Full Name"
                        value={full_name}
                        className="input-field"
                        type="text"
                      />
                    </div>
                    <div className="form-two">
                      <div className="input-pin">
                        <p className="placeholder">Pin</p>
                        <div className="form-field">
                          <input
                            required
                            onChange={handlePinChange}
                            placeholder="Pin"
                            value={pin}
                            className="input-field"
                            type="pin"
                            pattern="\d*"
                            maxLength="6"
                          />
                        </div>
                      </div>
                      <div className="input-age">
                        <p className="placeholder">Age</p>
                        <div className="form-field">
                          <input
                            required
                            onChange={(ev) => setAge(ev.target.value)}
                            placeholder="Age"
                            value={age}
                            className="input-field"
                            type="age"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="buttons">
                      <button className="send-btn">
                        {!!props.user.id ? "Confirm" : "Create"}
                      </button>
                      {!!props.user.id && (
                        <>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={PopupDelete}
                          >
                            Eliminar
                          </button>
                          <button
                            type="button"
                            className="playlist-btn"
                            onClick={() => {
                              chargallplaylist();
                              openPopupPlaylists();
                            }}
                          >
                            Playlists
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {showPopupDelete && (
              <div className="popupDeleted">
                <div className="card">
                  <div className="card-content">
                    <p className="card-heading">Delete acount</p>
                    <p className="card-description">
                      Are you sure you want to delete the account?
                    </p>
                  </div>
                  <div className="card-button-wrapper">
                    <button
                      className="card-button secondary"
                      onClick={PopupDelete}
                    >
                      Cancel
                    </button>
                    <button className="card-button primary" onClick={eliminate}>
                      Delete
                    </button>
                  </div>
                  <button className="exit-button" onClick={PopupDelete}>
                    <svg height="20px" viewBox="0 0 384 512">
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
            {showPopupAvatars && (
              <div className="ui-wrapper">
                <div
                  className={
                    "select-wrapper " + (showPopupAvatars && "selected")
                  }
                >
                  <ul>
                    {avatars.map((avatar, index) => (
                      <li key={index} onClick={() => setAvatar(avatar.url)}>
                        <img src={avatar.url} alt="" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {showPlaylists && (
            <>
              <div className="popup-overlay2-PLC">
                <div className="popup">
                  <div className="main">
                    <div className="top-bar">
                      <button
                        className="close-button"
                        onClick={openPopupPlaylists}
                      >
                        X
                      </button>
                    </div>
                    <div className="currentplaying">
                      <p className="heading">Playlists</p>
                    </div>
                    <div className="songs">
                      {playlistsAccount.map((playlist, index) => (
                        <>
                          <div className="loader" key={index}>
                            <div className="EditButtons">
                              <div className="buttons">
                                <button
                                  type="button"
                                  className="delete-btn"
                                  onClick={() => {
                                    chargeplaylist(playlist);
                                    PopupDeleteP();
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="song">
                              <p className="name">{playlist.name}</p>
                              <p className="artist">
                                {playlist.playlist.length}
                              </p>
                            </div>
                            <div className="albumcover"></div>
                          </div>
                          {showPopupDeleteP && (
                            <div className="popupDeleted">
                              <div className="card">
                                <div className="card-content">
                                  <p className="card-heading">
                                    Remove playlist
                                  </p>
                                  <p className="card-description">
                                    Are you sure you want to remove this
                                    plyalist?
                                  </p>
                                </div>
                                <div className="card-button-wrapper">
                                  <button
                                    className="card-button secondary"
                                    onClick={() => {
                                      chargeplaylist([]);
                                      PopupDeleteP();
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="card-button primary"
                                    onClick={()=>eliminatePlaylist(playlist)}
                                  >
                                    Remove
                                  </button>
                                </div>
                                <button
                                  className="exit-button"
                                  onClick={PopupDeleteP}
                                >
                                  <svg height="20px" viewBox="0 0 384 512">
                                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                      {showPopupPlaylistC && (
                        <div className="popup-overlay2">
                          <div className="popup">
                            <div className="main">
                              <div className="top-bar">
                                <button
                                  className="close-button"
                                  onClick={() => {
                                    chargeplaylist([]);
                                    closePopupPlaylistC();
                                  }}
                                >
                                  X
                                </button>
                              </div>
                              <div className="currentplaying">
                                <p className="heading">Playlists</p>
                              </div>
                              <div className="songs">
                                {playlists.map((playlist, index) => (
                                  <>
                                    <div className="loader" key={index}>
                                      <div className="EditButtons">
                                        <div className="buttons">
                                          <button
                                            className="send-btn"
                                            onClick={() => {
                                              chargeplaylist(playlist);
                                              addPlaylist(playlist);
                                            }}
                                          >
                                            Add
                                          </button>
                                        </div>
                                      </div>
                                      <div className="song">
                                        <p className="name">{playlist.name}</p>
                                        <p className="artist">
                                          {playlist.playlist.length}
                                        </p>
                                      </div>
                                      <div className="albumcover"></div>
                                    </div>
                                    {showPopupDeleteP && (
                                      <div className="popupDeleted">
                                        <div className="card">
                                          <div className="card-content">
                                            <p className="card-heading">
                                              Remove playlist
                                            </p>
                                            <p className="card-description">
                                              Are you sure you want to remove
                                              this plyalist?
                                            </p>
                                          </div>
                                          <div className="card-button-wrapper">
                                            <button
                                              className="card-button secondary"
                                              onClick={() => {
                                                chargeplaylist([]);
                                                PopupDeleteP();
                                              }}
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              className="card-button primary"
                                              onClick={eliminatePlaylist}
                                            >
                                              Remove
                                            </button>
                                          </div>
                                          <button
                                            className="exit-button"
                                            onClick={PopupDeleteP}
                                          >
                                            <svg
                                              height="20px"
                                              viewBox="0 0 384 512"
                                            >
                                              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </div>
                              <button
                                className="createvideo"
                                onClick={() => {
                                  closePopupPlaylistC();
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      className="createvideo"
                      onClick={() => {
                        chargallplaylist();
                        openPopupPlaylistC([]);
                      }}
                    >
                      Add Playlist
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default PerfilEdit;
