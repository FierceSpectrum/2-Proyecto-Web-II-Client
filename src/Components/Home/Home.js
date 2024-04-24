import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import User from "../User/User";
import ReactPlayer from "react-player";
import { display } from "styled-system";

function Home() {
  const navigate = useNavigate();

  const [playlistsAccount, setPlaylistsAccount] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPlaylists, setShowPlaylists] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  const [playlist, setPlaylist] = useState();
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState([]);

  const account = JSON.parse(localStorage.getItem("Account"));

  const openVideo = (video) => {
    // setVideo(video);
    setShowVideo(true);
  };
  const closeVideo = (video) => {
    // setVideo([]);
    setShowVideo(false);
  };

  useEffect(() => {
    if (!account) {
      navigate("/Profiles");
    }
  }, [account, navigate]);

  useEffect(() => {
    const chargplaylist = async () => {
      try {
        const playlistsAccount2 = await Promise.all(
          account.playlists.map(async (idplaylist) => {
            const urlaccounts = `http://localhost:3006/graphql`;
            const token = localStorage.getItem("token");
            const response = await fetch(urlaccounts, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                "query": `query { getPlaylist(id: "${idplaylist}" ) { id name playlist {name url description} } }`
              }),
            });
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const {data} = await response.json();
            // console.log('data')
            // console.log(data.data)
            // console.log(data.getPlaylist)
            // console.log(data)
            // console.log(data)
            return data.getPlaylist;
          })
        );
        console.log(playlistsAccount2)
        setPlaylistsAccount(playlistsAccount2);
        setLoading(false); // Marcar como terminada la carga cuando se obtienen los datos
      } catch (error) {
        console.log({ Error: error });
      }
    };
    chargplaylist();
  }, []);

  return (
    <>
      <div className="boddys">
        <User className="user"></User>
        <>
          {showPlaylists && (
            <>
              <div className="popup-overlay2-PLC-">
                <div className="popup">
                  <div className="main">
                    <div className="top-bar"></div>
                    <div className="currentplaying">
                      <p className="heading">Select Playlists</p>
                    </div>
                    <div className="songs">
                      {playlistsAccount.map((playlist, index) => (
                        <>
                          <div
                            className="loader"
                            key={index}
                            onClick={() => {
                              setVideos(playlist.playlist);
                              setShowVideo(true);
                              setShowPlaylists(false);
                            }}
                          >
                            <div className="EditButtons">
                              <div className="buttons">
                                <button
                                  className="send-btn"
                                  onClick={(e) => {
                                    setVideos(playlist.playlist);
                                    setShowVideo(true);
                                    setShowPlaylists(false);
                                  }}
                                >
                                  Select
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
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {showVideo && (
            <>
              <Videos videos={videos}></Videos>
            </>
          )}
        </>
      </div>
    </>
  );
}

function Videos(props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  const [videos, setVideos] = useState(props.videos);
  const [videosFilter, setVideosFilter] = useState(videos);
  const [video, setVideo] = useState([]);

  const account = JSON.parse(localStorage.getItem("Account"));

  const openVideo = (video) => {
    setVideo(video);
    setShowVideo(true);
  };
  const closeVideo = (video) => {
    setVideo([]);
    setShowVideo(false);
  };

  useEffect(() => {
    if (!account) {
      navigate("/Profiles");
    }
  }, [account, navigate]);

  useEffect(() => {}, []);

  // Función para convertir los videos a texto
  function convertirVideosATexto(videos) {
    return videos.map(
      (video) =>
        `${video.name.toLowerCase()} ${video.description.toLowerCase()}`
    );
  }

  // Función para manejar el cambio en el término de búsqueda
  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
    const videosTexto = convertirVideosATexto(videos);
    const videosFiltrados = videos.filter((video, index) => {
      return videosTexto[index].includes(event.target.value.toLowerCase());
    });
    setVideosFilter(videosFiltrados);
  }

  return (
    <>
      <div className="Buscador">
        <form
          className="form"
          action=""
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label for="search">
            <input
              className="input"
              type="text"
              required=""
              placeholder="Search twitter"
              id="search"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <div className="fancy-bg"></div>
            <div className="search">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-4wgw6l r-f727ji r-bnwqim r-1plcrui r-lrvibr"
              >
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
            </div>
            <button className="close-btn" type="reset">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </label>
        </form>
      </div>

      <div className="videos-container">
        {videosFilter.map((video, index) => (
          <>
            <div key={index} className="video-container">
              <ReactPlayer
                className="video"
                url={video.url}
                controls
                showRelated={false}
                autoPlay
                loop
                rel={0}
              />
              <h2>{video.name}</h2>
              <p>{video.description}</p>
              <div className="overlay" onClick={() => openVideo(video)}></div>
            </div>
          </>
        ))}
        {showVideo && (
          <div className="popup">
            <div className="popup-header">
              <button className="close-button" onClick={closeVideo}>
                X
              </button>
            </div>
            <div className="video-container-r">
              <h2>{video.name}</h2>
              <p>{video.description}</p>
              <ReactPlayer
                className="video-r"
                url={video.url}
                playing={true}
                controls
                showRelated={false}
                autoPlay
                loop
                rel={0}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
