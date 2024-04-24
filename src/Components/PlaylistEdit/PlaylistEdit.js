import React, { useState, useEffect } from "react";
import "./PlaylistEdit.scss";
import ReactPlayer from "react-player";

function PlaylistEdit(props) {
  const [request, setRequest] = useState(false);

  const [showPlaylists, setShowPlaylists] = useState(false);
  const [showPopupPlaylist, setShowPopupPlaylist] = useState(false);
  const [showPopupPlaylistC, setShowPopupPlaylistC] = useState(false);
  const [showPopupVideo, setShowPopupVideo] = useState(false);
  const [showPopupDeleteP, setShowPopupDeleteP] = useState(false);
  const [showPopupDeleteV, setShowPopupDeleteV] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [playlists, setPlaylists] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState([]);

  const [nameP, setNameP] = useState("");

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const openPopupPlaylists = () => {
    setShowPlaylists(!showPlaylists);
  };

  const PopupDeleteP = () => {
    setShowPopupDeleteP(!showPopupDeleteP);
  };

  const PopupDeleteV = () => {
    setShowPopupDeleteV(!showPopupDeleteV);
  };

  const chargevideos = (playlist) => {
    setVideos(playlist.playlist);
  };

  const chargevideo = (video) => {
    setVideo(video);
    setName(video.name);
    setUrl(video.url);
    setDescription(video.description);
  };

  const chargeplaylist = (playlist) => {
    setPlaylist(playlist);
    setNameP(playlist.name);
  };

  const openPopupPlaylist = () => {
    setShowPopupPlaylist(!showPopupPlaylist);
  };

  const openPopupPlaylistC = (playlist) => {
    chargeplaylist(playlist);
    setShowPopupPlaylistC(true);
  };
  const closePopupPlaylistC = (playlist) => {
    setShowPopupPlaylistC(false);
  };

  const openPopupVideo = (video) => {
    chargevideo(video);
    setShowPopupVideo(true);
  };
  const closePopupVideo = (video) => {
    setShowPopupVideo(false);
  };

  useEffect(() => {
    if (request) {
      window.location.reload();
    }
  }, [request, setRequest]);

  useEffect(() => {
    if (!playlists.length) {
      charge();
    }
  }, []);

  function verificarURLdeVideo(url) {
    const regex =
      /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  }

  const handleSubmitplaylist = () => {
    console.log("hola");
    if (!!playlist.id) {
      updatePlaylist();
      return;
    }
    createplaylist();
  };

  const handleSubmit = () => {
    const verificarurl = verificarURLdeVideo(url);
    if (!verificarurl) {
      setErrorMessage("Invalid video URL");
      return;
    }

    if (!!video.id) {
      update();
      return;
    }
    create();
  };

  const charge = async () => {
    try {
      const urlaccounts = `http://localhost:3006/graphql`;
      const token = localStorage.getItem("token");
      const response = await fetch(urlaccounts, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `query { getAllPlaylistsUser(iduser: "${props.iduser}" ) { id name playlist {  id name url description }} }`,
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

  const createplaylist = async () => {
    const urlplaylis = `http://localhost:3002/api/playlists`;
    const token = localStorage.getItem("token");
    const data = await {
      name: nameP,
      user: props.iduser,
    };
    await fetch(urlplaylis, {
      method: "Post",
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
        openPopupPlaylists();
        console.log(data);
      })
      .catch((err) => {
        setErrorMessage("Datos invalidos");
      });
  };

  const updatePlaylist = async () => {
    const urlplaylis = `http://localhost:3002/api/playlists?id=${playlist.id}`;
    const token = localStorage.getItem("token");
    const data = await {
      name: nameP,
    };

    await fetch(urlplaylis, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(video.id);
          console.log(playlist.id);
          setErrorMessage("Error con la conexion");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRequest(true);
        openPopupPlaylists();
      })
      .catch((err) => {
        setErrorMessage("Datos invalidos");
      });
  };

  const update = async () => {
    const urlplaylis = `http://localhost:3002/api/videos?id=${playlist.id}&idvideo=${video.id}`;
    const token = localStorage.getItem("token");
    const data = await {
      name: name,
      url: url,
      description: description,
    };

    await fetch(urlplaylis, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(video.id);
          console.log(playlist.id);
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
    const urlplaylis = `http://localhost:3002/api/videos`;
    const token = localStorage.getItem("token");
    console.log(playlist.id);
    const data = await {
      name: name,
      url: url,
      description: description,
      playlist: playlist.id,
    };

    await fetch(urlplaylis, {
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

  const eliminatePlaylist = async () => {
    const urlplaylis = `http://localhost:3002/api/playlists?id=${playlist.id}`;
    const token = localStorage.getItem("token");
    await fetch(urlplaylis, {
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

  const eliminateVideo = async () => {
    const urlplaylis = `http://localhost:3002/api/videos?id=${playlist.id}&idvideo=${video.id}`;
    const token = localStorage.getItem("token");
    await fetch(urlplaylis, {
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

  return (
    <div className="playlistEdit">
      <button className="animated-button" onClick={() => openPopupPlaylists()}>
        <span className="circle"></span>
        <svg
          viewBox="0 0 24 24"
          className="arr-2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
        <span className="text">Edit Playlist</span>
        <svg
          viewBox="0 0 24 24"
          className="arr-1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
      </button>
      {showPlaylists && (
        <>
          <div className="popup">
            <div className="main">
              <div className="top-bar">
                <button className="close-button" onClick={openPopupPlaylists}>
                  X
                </button>
              </div>
              <div className="currentplaying">
                <p className="heading">Edit Playlists</p>
              </div>
              <div className="songs">
                {playlists.map((playlist, index) => (
                  <>
                    <div
                      className="loader"
                      key={index}
                      onClick={() => {
                        chargeplaylist(playlist);
                        chargevideos(playlist);
                        openPopupPlaylist();
                      }}
                    >
                      <div className="EditButtons">
                        <div className="buttons">
                          <button
                            className="send-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPopupPlaylistC(playlist);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
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
                        <p className="artist">{playlist.playlist.length}</p>
                      </div>
                      <div className="albumcover"></div>
                    </div>
                    {showPopupDeleteP && (
                      <div className="popupDeleted">
                        <div className="card">
                          <div className="card-content">
                            <p className="card-heading">Delete playlist</p>
                            <p className="card-description">
                              Are you sure you want to delete the plyalist?
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
                              Delete
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
                {showPopupPlaylist && (
                  <>
                    <div className="popup">
                      <div className="main">
                        <div className="top-bar">
                          <button
                            className="close-button"
                            onClick={openPopupPlaylist}
                          >
                            X
                          </button>
                        </div>
                        <div className="currentplaying">
                          <p className="heading">Edit {nameP} </p>
                        </div>
                        <div className="songs">
                          {videos.map((video, index) => (
                            <>
                              <div className="loader" key={index}>
                                <div className="EditButtons">
                                  <div className="buttons">
                                    <button
                                      className="send-btn"
                                      onClick={() => openPopupVideo(video)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="delete-btn"
                                      onClick={() => {
                                        chargevideo(video);
                                        PopupDeleteV();
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                                <div className="song">
                                  <p className="name">{video.name}</p>
                                  <p className="artist">{video.url}</p>
                                </div>
                                <div className="albumcover"></div>
                              </div>
                              {showPopupDeleteV && (
                                <div className="popupDeleted">
                                  <div className="card">
                                    <div className="card-content">
                                      <p className="card-heading">
                                        Delete acount
                                      </p>
                                      <p className="card-description">
                                        Are you sure you want to delete the
                                        account?
                                      </p>
                                    </div>
                                    <div className="card-button-wrapper">
                                      <button
                                        className="card-button secondary"
                                        onClick={() => {
                                          chargevideo([]);
                                          PopupDeleteV();
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className="card-button primary"
                                        onClick={eliminateVideo}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                    <button
                                      className="exit-button"
                                      onClick={PopupDeleteV}
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
                          {showPopupVideo && (
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
                                            name === video.name &&
                                            url === video.url &&
                                            description === video.description
                                          )
                                        ) {
                                          handleSubmit();
                                        }
                                      }}
                                    >
                                      <div className="popup-header">
                                        <button
                                          className="close-button"
                                          onClick={closePopupVideo}
                                        >
                                          X
                                        </button>
                                      </div>
                                      <p className="form-heading">
                                        Get In Touch
                                      </p>
                                      <p className="Error">{errorMessage}</p>
                                      <p className="placeholder">Name</p>
                                      <div className="form-field">
                                        <input
                                          required
                                          onChange={(ev) =>
                                            setName(ev.target.value)
                                          }
                                          placeholder="Name"
                                          value={name}
                                          className="input-field"
                                          type="text"
                                        />
                                      </div>
                                      <div className="form-two">
                                        <div className="input-pin">
                                          <p className="placeholder">Url</p>
                                          <div className="form-field">
                                            <input
                                              required
                                              onChange={(ev) =>
                                                setUrl(ev.target.value)
                                              }
                                              placeholder="Url"
                                              value={url}
                                              className="input-field"
                                              type="url"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <p className="placeholder">Description</p>
                                      <div className="form-field">
                                        <input
                                          onChange={(ev) =>
                                            setDescription(ev.target.value)
                                          }
                                          placeholder="Description"
                                          value={description}
                                          className="input-field"
                                          type="text"
                                        />
                                      </div>
                                      <div className="buttons">
                                        <button className="send-btn">
                                          Confirmar
                                        </button>
                                        <button
                                          type="button"
                                          className="delete-btn"
                                          onClick={closePopupVideo}
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          className="createvideo"
                          onClick={() => openPopupVideo([])}
                        >
                          New Video
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {showPopupPlaylistC && (
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
                              if (!(nameP === playlist.name)) {
                                handleSubmitplaylist();
                              }
                            }}
                          >
                            <div className="popup-header">
                              <button
                                className="close-button"
                                onClick={closePopupPlaylistC}
                              >
                                X
                              </button>
                            </div>
                            <p className="form-heading">Get In Touch</p>
                            <p className="Error">{errorMessage}</p>

                            <p className="placeholder">Name</p>
                            <div className="form-field">
                              <input
                                required
                                onChange={(ev) => setNameP(ev.target.value)}
                                placeholder="Name"
                                value={nameP}
                                className="input-field"
                                type="text"
                              />
                            </div>
                            <div className="buttons">
                              <button className="send-btn">Confirmar</button>
                              <button
                                type="button"
                                className="delete-btn"
                                onClick={closePopupPlaylistC}
                              >
                                Cancelar
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                className="createvideo"
                onClick={() => {
                  openPopupPlaylistC([]);
                }}
              >
                New Playlist
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PlaylistEdit;
